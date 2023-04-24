import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { FilesService } from '../files/files.service';
import { initialData } from './data/seed';

@Injectable()
export class SeedService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configServices: ConfigService,
    private readonly fileServices: FilesService,
  ) {}

  async executeSeed() {
    await this.clearData();
    await this.createData();
    return 'Seed executed successfully';
  }

  private async clearData(): Promise<void> {
    const photos = await this.prisma.photo.findMany({
      select: { name: true },
    });
    if (photos.length > 0)
      photos.map((photo) =>
        this.fileServices
          .deleteFileMinioStorage(photo.name)
          .catch((err) => console.log(err)),
      );
    await this.prisma.user.deleteMany();
  }

  private async createData() {
    await this.prisma.user
      .createMany({ data: initialData.users })
      .catch((err) => console.log(err));
    await this.prisma.profile.createMany({ data: initialData.profiles });
    await this.prisma.photo.createMany({ data: initialData.photos });
  }
}
