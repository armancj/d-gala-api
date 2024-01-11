import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import minioConfig from './config/minio.config';
import { MinioModule } from 'nestjs-minio-client';
import { APP_CONFIG_MINIO } from './config/constant';
import { ColorsModule } from '../store/colors/colors.module';

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
    ColorsModule,
  ],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
