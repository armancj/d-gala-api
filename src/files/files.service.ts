import { createReadStream } from 'fs';
import {
  BadGatewayException,
  ConflictException,
  Injectable,
  NotFoundException,
  StreamableFile,
  UnauthorizedException,
} from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { ConfigService } from '@nestjs/config';
import { MINIO_ENV } from './config/constant';
import { PrismaService } from '../prisma/prisma.service';
import { HandlerError } from '../common/utils/handler-error';
import { appConstant } from '../config/app.constant';
import { MinioPolicy, MinioRoute } from './enum/minio.enum';
import { Photo, Prisma, User } from '@prisma/client';
import { EnumUserRole } from '../user/enum/user-role.enum';

interface PhotoIdInterface {
  productId?: number;
  profileId?: number;
}

interface PhotoInterface {
  photo: Photo & {
    product: Prisma.ProductGetPayload<
      { product: boolean; profile: boolean }['product']
    > | null;
    profile: Prisma.ProfileGetPayload<
      { product: boolean; profile: boolean }['profile']
    > | null;
  };
}

@Injectable()
export class FilesService {
  constructor(
    private readonly minioService: MinioService,
    private readonly _configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  get bucket(): string {
    return this._configService.get<string>(MINIO_ENV.MINIO_BUCKET);
  }
  private url(bucket: string): string {
    const host = this._configService.get<string>(MINIO_ENV.MINIO_ENDPOINT);
    const port = this._configService.get<string>(MINIO_ENV.MINIO_PORT);
    const protocol =
      this._configService.get(appConstant.STATE) === 'dev'
        ? MINIO_ENV.PROTOCOL
        : MINIO_ENV.PROTOCOL_SECURE;
    return `${protocol}${host}:${port}/${bucket}`;
  }

  async downloadFile(fileName: string) {
    try {
      await this.createOrExistsBucket(this.bucket);
      return await this.minioService.client.getObject(this.bucket, fileName);
    } catch (e) {
      throw new NotFoundException(`Not found image with name : ${fileName}`);
    }
  }

  async uploadsFileToProduct(
    files: Array<Express.Multer.File>,
    productId: number,
  ) {
    await this.createOrExistsBucket(this.bucket);
    return Promise.all(
      files.map(async (file) => {
        return await this.photoToBd(file, MinioRoute.product, {
          productId,
        });
      }),
    );
  }

  async uploadFileToProfile(file: Express.Multer.File, id: number) {
    await this.createOrExistsBucket(this.bucket);
    const profileId: number = await this.findProfileIdByUserID(id);
    return await this.photoToBd(file, MinioRoute.profile, { profileId });
  }

  private async findProfileIdByUserID(id: number): Promise<number> {
    const profile = await this.prisma.profile.findFirst({
      where: { user: { id } },
      include: { photo: true },
    });
    if (!profile) throw new NotFoundException(`Need Create to profile first`);

    if (profile?.photo)
      throw new ConflictException(`You Have to a photo upload in the profile`);
    return profile.id;
  }

  private async photoToBd(
    file: Express.Multer.File,
    newFolderPath: string,
    photoId?: PhotoIdInterface,
  ): Promise<Photo> {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        const minioData = await this.fileToMinioStorage(file, newFolderPath);
        return prisma.photo
          .create({
            data: {
              url: minioData.url,
              name: file.filename,
              space: file.size,
              profile: this.getProfileOrProductId(photoId.profileId),
              product: this.getProfileOrProductId(photoId.productId),
            },
          })
          .catch(async (err) => {
            if (minioData)
              await this.deleteFileMinioStorage(newFolderPath + file.filename);
            throw err;
          });
      });
    } catch (err) {
      HandlerError(err, err?.meta);
    }
  }

  private getProfileOrProductId(id?: number) {
    return id ? { connect: { id } } : undefined;
  }

  private async fileToMinioStorage(
    file: Express.Multer.File,
    newFolderPath: string,
  ) {
    try {
      const data = new StreamableFile(createReadStream(file.path));
      await this.minioService.client.putObject(
        this.bucket,
        newFolderPath + file.filename,
        data.getStream(),
        file.size,
      );
      const url = this.url(this.bucket) + newFolderPath + file.filename;
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

  private async deleteFileMinioStorage(objectName: string): Promise<void> {
    return await this.minioService.client
      .removeObject(this.bucket, objectName)
      .catch((err) => {
        throw err;
      });
  }

  async changePolicy(policyEnable: MinioPolicy) {
    await this.createOrExistsBucket(this.bucket);

    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: policyEnable === MinioPolicy.public ? 'Allow' : 'Deny',
          Principal: '*',
          Action: 's3:GetObject',
          Resource: [`arn:aws:s3:::${this.bucket}/*`],
        },
      ],
    };

    await this.minioService.client
      .setBucketPolicy(this.bucket, JSON.stringify(policy))
      .catch((err) => {
        throw new BadGatewayException(err);
      });
    return `The bucket: ${this.bucket} is change to ${policyEnable}`;
  }

  async deletePhotoByFilename(fileName: string, user: User) {
    const findOnePhoto = await this.prisma.photo
      .findUniqueOrThrow({
        where: { name: fileName },
        include: { profile: true, product: true },
      })
      .catch((err) => HandlerError(err));
    return await this.deleteProfilePhoto({ photo: findOnePhoto }, user);
  }

  private async deleteProfilePhoto(data: PhotoInterface, user: User) {
    const photoName = this.getPhotoNameProductOrProfile(data, user);
    try {
      const photoDelete = await this.prisma.photo.delete({
        where: {
          profileId: data.photo.profile.id || undefined,
        },
      });
      await this.deleteFileMinioStorage(photoName);
      return photoDelete;
    } catch (err) {
      console.log(err);
    }
  }

  private getPhotoNameProductOrProfile(data: PhotoInterface, user: User) {
    if (data.photo?.profile) {
      if (data.photo.profile.userId !== user.id)
        throw new UnauthorizedException(`User only delete owner profile image`);
      return MinioRoute.profile + data.photo.name;
    }
    if (data.photo?.product) {
      if (user.role.includes(EnumUserRole.USER))
        throw new UnauthorizedException(
          `Only delete product image by user with role: ${EnumUserRole.SUADMIN}, ${EnumUserRole.ADMIN} or ${EnumUserRole.WORKER}`,
        );
      return MinioRoute.product + data.photo.name;
    }
  }
}
