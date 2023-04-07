import { Module } from '@nestjs/common';
import { MinioService } from './minio.service';
import { MinioController } from './minio.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MinioModule as Minio } from 'nestjs-minio-client'; //yarn add nestjs-Minio-client yarn add -D @types/Minio
import { APP_CONFIG_MINIO } from './config/constant';
import minioConfig from './config/minio.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [minioConfig],
    }),
    Minio.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get(APP_CONFIG_MINIO),
    }),
  ],
  controllers: [MinioController],
  providers: [MinioService],
})
export class MinioModule {}
