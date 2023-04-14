import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import minioConfig from './config/minio.config';
import { MinioModule } from 'nestjs-minio-client';
import { APP_CONFIG_MINIO } from './config/constant';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../authentication/guard';
import { ExceptionLoggerFilter } from '../common/filter/exception-logger.filter';
import { APP_INTERCEPTOR } from '@nestjs/core/constants';
import { LoggingInterceptor } from '../common/interceptors/loggin.interceptor';
import { TimeoutInterceptor } from '../common/interceptors/timeout.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [minioConfig],
    }),
    MinioModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get(APP_CONFIG_MINIO),
    }),
  ],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
