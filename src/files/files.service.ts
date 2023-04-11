import { join } from 'path';
import { createReadStream, existsSync } from 'fs';
import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  StreamableFile,
} from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { ConfigService } from '@nestjs/config';
import { MINIO_BUCKET } from './config/constant';
import { config } from 'rxjs';
import { filename } from './helpers';

@Injectable()
export class FilesService {
  constructor(
    private readonly minioService: MinioService,
    private readonly _configService: ConfigService,
  ) {}

  get bucket(): string {
    return this._configService.get<string>(MINIO_BUCKET);
  }

  getStaticFile(fileName: string) {
    const path = join(process.cwd(), 'static/products', fileName);

    console.log(path);

    if (!existsSync(path))
      throw new BadRequestException(`No file found with filename: ${fileName}`);

    return path;
  }

  async uploadFile(files: Array<Express.Multer.File>) {
    await this.createOrExistsBucket(this.bucket);
    return files.map(async (file) => {
      const data = new StreamableFile(createReadStream(file.path));
      await this.minioService.client
        .putObject(this.bucket, file.filename, data.getStream(), file.size)
        .catch((err) => {
          throw new BadGatewayException(err);
        });
      return {
        url: `${this._configService.get<string>(
          'MINIO_ENDPOINT',
        )}:${this._configService.get<string>('MINIO_PORT')}/${this.bucket}/${
          file.filename
        }`,
        message: 'Successfully uploaded to MinIO S3',
      };
    });
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
