import { Module } from '@nestjs/common';
import { MinioStorageService } from './minio-storage.service';
import { MinioStorageController } from './minio-storage.controller';
import { MinioModule } from 'nestjs-minio-client';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { minioStorage } from './config/minio-storage.constant';
import { appConstant } from '../config/app.constant';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule,
    /*MinioModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        endPoint: config.get<string>(minioStorage.MINIO_ENDPOINT),
        useSSL: config.get<string>(appConstant.STATE) !== 'dev',
        port: +config.get<string>(minioStorage.MINIO_PORT) || 9001,
        accessKey: config.get<string>(minioStorage.MINIO_ROOT_USER),
        secretKey: config.get<string>(minioStorage.MINIO_ROOT_PASSWORD),
      }),
    }),*/
  ],
  controllers: [MinioStorageController],
  providers: [MinioStorageService],
})
export class MinioStorageModule {}
