import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MinioStorageService } from './minio-storage.service';
import { CreateMinioStorageDto } from './dto/create-minio-storage.dto';
import { UpdateMinioStorageDto } from './dto/update-minio-storage.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Storage')
@Controller('minio-storage')
export class MinioStorageController {
  constructor(private readonly minioStorageService: MinioStorageService) {}

  @Post()
  create(@Body() createMinioStorageDto: CreateMinioStorageDto) {
    return this.minioStorageService.create(createMinioStorageDto);
  }

  @Get()
  findAll() {
    return this.minioStorageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.minioStorageService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMinioStorageDto: UpdateMinioStorageDto,
  ) {
    return this.minioStorageService.update(+id, updateMinioStorageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.minioStorageService.remove(+id);
  }
}
