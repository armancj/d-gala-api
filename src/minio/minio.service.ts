import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Stream } from 'stream';
import { APP_CONFIG_MINIO, MINIO_BUCKET } from './config/constant';
import * as process from 'process';
import { MinioService as Minio, MinioClient, MinioCopyConditions, ExtraConfiguration } from 'nestjs-minio-client';

@Injectable()
export class MinioService {
  constructor(
    private readonly minioClient: Minio,
    private readonly configService: ConfigService,
  ) {}

  private readonly _baseBucket = this.configService.get(APP_CONFIG_MINIO);

  /**
   *
   * @param bucketName  The name of bucket
   * @param fileName The name of file
   * @param stream The encoded file
   * @returns Promise with file version
   * @abstract Save any file
   */
  async saveAny(
    fileName: string,
    stream: string | Buffer,
    bucketName?: string,
  ) {
    const bucket = bucketName || this.configService.get<string>(MINIO_BUCKET);
    return this.minioClient.client.putObject(bucket, fileName, stream);
  }

  async load(
    productId: string,
    fileName: string,
    encoding = false,
    bucketName: string = this.configService.get<string>(MINIO_BUCKET),
  ): Promise<Stream | any> {
    try {
      const file: Stream = await this.minioClient.client.getObject(
        bucketName,
        productId + '/' + fileName,
      );
      if (encoding) {
        const encode = await this.streamToString(file, 'base64');
        const mimeType = await this.getMimeType(fileName);
        const type = `data:${mimeType};charset=utf-8;base64,`;
        return type + encode;
      }
      return file;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  //Load any File
  /**
   *
   * @param fileName string
   * @param bucketName string
   * @returns Any file in string base64 encode
   */
  async loadFile(fileName: string, bucketName?: string): Promise<Stream | any> {
    const bucket = bucketName || this.configService.get<string>('MINIO_BUCKET');
    try {
      const file: Stream = await this.minioClient.client.getObject(
        bucket,
        fileName,
      );
      const encode = await this.streamToString(file, 'base64');
      const mimeType = await this.getMimeType(fileName);
      const type = `data:${mimeType};charset=utf-8;base64,`;
      return type + encode;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
  private async streamToString(
    stream: Stream,
    encoding: BufferEncoding,
  ): Promise<string> {
    const chunks = [];
    return new Promise((resolve, reject) => {
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('error', reject);
      stream.on('end', () =>
        resolve(
          // Buffer.concat(chunks).toString()
          Buffer.concat(chunks).toString(encoding),
        ),
      );
    });
  }

  public async getMimeType(filename: string): Promise<string | null> {
    let mimeType = null;
    const mimeType2 = await this.minioClient.client.statObject(
      process.env.MINIO_BUCKET,
      filename,
    );
    //console.Log('mime type ',mimeType2.metaData)

    if (filename) {
      const regx = /(?:\.([^.]+))?$/;
      const extension = regx.exec(filename)[1];
      switch (extension) {
        case 'png':
          mimeType = 'image/png';
          break;
        case 'gif':
          mimeType = 'image/gif';
          break;
        case 'jpg':
          mimeType = 'image/jpg';
          break;
        case 'jpeg':
          mimeType = 'image/jpeg';
          break;
        default:
          mimeType = mimeType2.metaData['content-type'];
      }
    }
    //console.Log('mime ',mimeType)

    return mimeType;
  }

  async getBuckets() {
    return this.minioClient.client.listBuckets();
  }
  async create(): Promise<void> {
    const bucketName = this.configService.get<string>(MINIO_BUCKET);
    if (!bucketName)
      throw new BadRequestException('No MINIO_BUCKET environment found');
    return await this.minioClient.client.makeBucket(bucketName, 'us-east-1');
  }
  async delete(objetName: string, baseBucket: string = this._baseBucket) {
    this.minioClient.client.removeObject(baseBucket, objetName, (err) => {
      if (err)
        throw new HttpException(
          'Oops Something wrong happened',
          HttpStatus.BAD_REQUEST,
        );
    });
  }
}
