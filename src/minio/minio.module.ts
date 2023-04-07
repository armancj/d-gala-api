import { Module } from '@nestjs/common';
import { MinioService } from './minio.service';
import { MinioController } from './minio.controller';
import { NestMinioModule } from 'nestjs-minio';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_CONFIG_MINIO } from './config/constant';
import { NestMinioOptions } from 'nestjs-minio/dist/interfaces';
import minioConfig from './config/minio.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [minioConfig],
    }),
    NestMinioModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        config.get<NestMinioOptions>(APP_CONFIG_MINIO),
    }),
  ],
  controllers: [MinioController],
  providers: [MinioService],
})
export class MinioModule {}
