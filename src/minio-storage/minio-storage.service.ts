import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { MinioStorageController } from './minio-storage.controller';
import { ConfigService } from '@nestjs/config';
import { minioStorage } from './config/minio-storage.constant';
import * as crypto from 'crypto';

@Injectable()
export class MinioStorageService {
  private readonly logger: Logger = new Logger(MinioStorageController.name);
  constructor(
    //private readonly minioService: MinioService,
    private readonly configServices: ConfigService,
  ) {}

  /*async listAllBuckets() {
    return this.minioService.client.listBuckets();
  }

  async uploadFile(
    file: any,
    baseBucket: string = this.configServices.get<string>(
      minioStorage.MINIO_BUCKET,
    ),
  ) {
    if (!(file.mimetype.includes('jpeg') || file.mimetype.includes('png'))) {
      throw new HttpException('Error uploading file', HttpStatus.BAD_REQUEST);
    }
    const temp_filename = Date.now().toString();
    const hashedFileName = crypto
      .createHash('md5')
      .update(temp_filename)
      .digest('hex');
    const ext = file.originalname.substring(
      file.originalname.lastIndexOf('.'),
      file.originalname.length,
    );
    const metaData = {
      'Content-Type': file.mimetype,
      'X-Amz-Meta-Testing': 1234,
    };
    const filename = hashedFileName + ext;
    const fileName = `${filename}`;
    const fileBuffer = file.buffer;
    this.minioService.client.putObject(
      baseBucket,
      fileName,
      fileBuffer,
      function (err) {
        if (err)
          throw new HttpException(
            'Error uploading file',
            HttpStatus.BAD_REQUEST,
          );
      },
    );

    return {
      //url: `${this.configServices.get<string>()}:${config.MINIO_PORT}/${config.MINIO_BUCKET}/${filename}`,
    };
  }*/
}
