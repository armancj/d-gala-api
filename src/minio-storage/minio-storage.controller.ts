import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Logger,
} from '@nestjs/common';
import { MinioStorageService } from './minio-storage.service';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from '../authentication/decorator';

@ApiTags('Storage')
@Public()
@Controller('minio-storage')
export class MinioStorageController {
  constructor(private readonly minioStorageService: MinioStorageService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
  }

  @Get()
  getBucket() {
    //return this.minioStorageService.listAllBuckets();
  }
}
