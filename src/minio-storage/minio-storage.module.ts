import { Module } from '@nestjs/common';
import { MinioStorageService } from './minio-storage.service';
import { MinioStorageController } from './minio-storage.controller';

@Module({
  controllers: [MinioStorageController],
  providers: [MinioStorageService]
})
export class MinioStorageModule {}
