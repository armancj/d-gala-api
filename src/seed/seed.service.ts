import {
  BadGatewayException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { FilesService, PhotoIdInterface } from '../files/files.service';
import { initialData } from './data/seed';
import { Prisma } from '@prisma/client';
import * as fs from 'fs';
import { appConstant, statusState } from '../config/app.constant';

enum ProfileOrProducts {
  product = 'product',
  profile = 'profile',
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
    //await this.createData();
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
  }

  private async createData() {
    await this.prisma.user
      .createMany({ data: initialData.users })
      .catch((err) => console.log(err));
    await this.prisma.category
      .createMany({ data: initialData.category })
      .catch((err) => console.log(err));
    /*await this.createManyProfile(initialData.profiles);*/
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
