import {
  BadGatewayException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { FilesService } from '../files/files.service';
import { initialData } from './data/seed';
import { Product } from '@prisma/client';
import { appConstant, statusState } from '../config/app.constant';
import { HandlerError } from '../common/utils/handler-error';
import {
  Connect,
  SeedProduct,
  updatePhotoInterface,
} from './interface/seed.interface';
import { ProfileOrProducts } from './enum/seed.enum';

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
    await this.prisma.photo.deleteMany();
  }

  private async createData() {
    await this.prisma.user
      .createMany({ data: initialData.users })
      .catch((err) => console.log(err));
    await this.prisma.category
      .createMany({ data: initialData.categories })
      .catch((err) => console.log(err));
    await this.prisma.profile
      .createMany({ data: initialData.profiles })
      .catch((err) => console.log(err));
    await this.prisma.photo.createMany({
      data: initialData.photos,
    });
    await this.createManyProducts(initialData.products);
    await this.uploadFilePhoto();
  }

  private async createManyProducts(products: SeedProduct[]) {
    for (const product of products) {
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
      this.createPhoto(photosName, productCreated.id);
    }
  }

  private createPhoto(photosName: string[], id: number) {
    photosName.forEach((name) => {
      this.prisma.photo
        .create({
          data: {
            name,
            space: 0,
            url: '',
            product: { connect: { id } },
          },
        })
        .catch((err) => {
          throw new InternalServerErrorException(err);
        });
    });
  }

  private async uploadFilePhoto() {
    const photos = await this.prisma.photo.findMany();
    photos.map(async (photo) => {
      let newFolderPath;
      if (photo?.profileId) newFolderPath = `/${ProfileOrProducts.profile}/`;
      if (photo?.productId) newFolderPath = `/${ProfileOrProducts.products}/`;
      const cloudItemStat = await this.uploadToCloud(newFolderPath, photo.name);
      await this.updatePhoto({
        id: photo.id,
        ...cloudItemStat,
      });
    });
  }

  private async updatePhoto(params: updatePhotoInterface) {
    const { id, url, space } = params;
    await this.prisma.photo.update({
      where: { id },
      data: { url, space },
    });
  }

  private async uploadToCloud(newFolderPath, filename: string) {
    const path: string = process.cwd() + `/static${newFolderPath}`;
    const file: Express.Multer.File = {
      filename: filename,
      path: path + filename,
      size: 0,
    } as Express.Multer.File;
    const minioFile = await this.fileServices.fileToMinioStorage(
      file,
      newFolderPath,
    );
    const space = await this.fileServices.getObjectSize(
      newFolderPath + filename,
    );
    return { space, url: minioFile.url };
  }
}
