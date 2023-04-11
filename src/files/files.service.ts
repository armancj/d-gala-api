import { createReadStream } from 'fs';
import {
  BadGatewayException,
  Injectable,
  StreamableFile,
} from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { ConfigService } from '@nestjs/config';
import { MINIO_BUCKET } from './config/constant';
import { PrismaService } from '../prisma/prisma.service';
import { Photo } from '@prisma/client';

interface PhotoIdInterface {
  productId?: number;
  profileId?: number;
}

@Injectable()
export class FilesService {
  constructor(
    private readonly minioService: MinioService,
    private readonly _configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  get bucket(): string {
    return this._configService.get<string>(MINIO_BUCKET);
  }

  async downloadFile(fileName: string) {
    try {
      await this.createOrExistsBucket(this.bucket);
      return await this.minioService.client.getObject(this.bucket, fileName);
    } catch (e) {
      console.log(e);
    }
  }

  async uploadsFileToProduct(
    files: Array<Express.Multer.File>,
    productId: number,
  ) {
    await this.createOrExistsBucket(this.bucket);
    return Promise.all(
      files.map(async (file) => {
        return await this.photoToBd(file, { productId });
      }),
    );
  }

  async uploadFileToProfile(file: Express.Multer.File, profileId: number) {
    await this.createOrExistsBucket(this.bucket);
    return await this.photoToBd(file, { profileId });
  }

  private async photoToBd(
    file: Express.Multer.File,
    photoId?: PhotoIdInterface,
  ): Promise<Photo> {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        const minioData = await this.fileToMinioStorage(file);
        return prisma.photo.create({
          data: {
            url: minioData.url,
            name: file.filename,
            space: file.size,
            ...photoId,
          },
        });
      });
    } catch (e) {
      throw e;
    }
  }

  private async fileToMinioStorage(file: Express.Multer.File) {
    try {
      const data = new StreamableFile(createReadStream(file.path));
      await this.minioService.client.putObject(
        this.bucket,
        file.filename,
        data.getStream(),
        file.size,
      );
      const url = await this.minioService.client.presignedGetObject(
        this.bucket,
        file.filename,
      );
      return {
        url,
        message: 'Successfully uploaded to MinIO S3',
      };
    } catch (err) {
      throw new BadGatewayException(err);
    }
  }

  private async createOrExistsBucket(bucket: string): Promise<void> {
    try {
      const IsExistBucket = await this.minioService.client.bucketExists(bucket);
      if (!IsExistBucket) await this.minioService.client.makeBucket(bucket);
    } catch (err) {
      throw new BadGatewayException(err);
    }
  }
}
