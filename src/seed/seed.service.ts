import {
  BadGatewayException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { FilesService, PhotoIdInterface } from '../files/files.service';
import { initialData, SeedProduct } from './data/seed';
import { Prisma, Product } from '@prisma/client';
import * as fs from 'fs';
import { appConstant, statusState } from '../config/app.constant';
import { HandlerError } from '../common/utils/handler-error';

enum ProfileOrProducts {
  products = 'products',
  profile = 'profile',
}

interface Connect {
  connect: { id: number };
}

@Injectable()
export class SeedService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configServices: ConfigService,
    private readonly fileServices: FilesService,
  ) {}

  async executeSeed() {
    const isProd: boolean = this.getProd();
    if (isProd)
      throw new ForbiddenException('This is environment of production');
    await this.clearData();
    await this.createData();
    return 'Seed executed successfully';
  }

  private getProd() {
    return (
      this.configServices.get<string>(appConstant.STATE) ===
      statusState.production
    );
  }

  private async clearData(): Promise<void> {
    const photos = await this.prisma.photo.findMany({
      select: { name: true, url: true },
    });
    if (photos.length > 0)
      photos.map((photo) => {
        const photoName = photo.url.split('/')[4] + '/' + photo.name;
        this.fileServices.deleteFileMinioStorage(photoName).catch((err) => {
          throw new BadGatewayException(err);
        });
      });
    await this.prisma.user.deleteMany();
    await this.prisma.product.deleteMany();
  }

  private async createData() {
    await this.prisma.user
      .createMany({ data: initialData.users })
      .catch((err) => console.log(err));
    await this.prisma.category
      .createMany({ data: initialData.categories })
      .catch((err) => console.log(err));
    await this.createManyProfile(initialData.profiles);
    await this.createManyProducts(initialData.products);
  }

  private async createManyProducts(products: SeedProduct[]) {
    console.log('here');
    products.map(async (product) => {
      const { categoryId, photosName, userId, gender, ...restProduct } =
        product;
      const user: Connect = { connect: { id: userId } };
      const categories: Connect = { connect: { id: categoryId } };
      const productCreated: Product = await this.prisma.product
        .create({
          data: {
            ...restProduct,
            gender,
            user,
            categories,
          },
        })
        .catch((err) => {
          HandlerError(err);
        });
      photosName.map(async (photoName) => {
        const path: string =
          process.cwd() + `/static/${ProfileOrProducts.products}/${photoName}`;
        console.log(path);
        const file: Express.Multer.File = {
          filename: photoName,
          path: path,
          size: 0,
        } as Express.Multer.File;
        const photoId: PhotoIdInterface = { productId: productCreated.id };
        await this.fileServices.photoToBd(
          file,
          `/${ProfileOrProducts.products}/`,
          photoId,
        );
      });
    });
  }
  private async createManyPhoto(route: ProfileOrProducts) {
    const path: string = process.cwd() + `/static/${route}/`;
    const photosName = fs.readdirSync(path, 'utf8');
    photosName.map(async (photoName) => {
      const file: Express.Multer.File = {
        filename: photoName,
        path: path + photoName,
        size: 0,
      } as Express.Multer.File;
      const photoId: PhotoIdInterface = {};
      if (route === ProfileOrProducts.profile)
        photoId.profileId = +file.filename.split('.')[0];
      await this.fileServices.photoToBd(file, `/${route}/`, photoId);
    });
  }

  private async createManyProfile(
    profiles: Prisma.ProfileCreateManyInput[],
  ): Promise<void> {
    await this.prisma.profile.createMany({ data: profiles });
    await this.createManyPhoto(ProfileOrProducts.profile);
  }
}
