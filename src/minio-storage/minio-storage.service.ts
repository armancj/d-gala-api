import { Injectable } from '@nestjs/common';
import { CreateMinioStorageDto } from './dto/create-minio-storage.dto';
import { UpdateMinioStorageDto } from './dto/update-minio-storage.dto';

@Injectable()
export class MinioStorageService {
  create(createMinioStorageDto: CreateMinioStorageDto) {
    return 'This action adds a new minioStorage';
  }

  findAll() {
    return `This action returns all minioStorage`;
  }

  findOne(id: number) {
    return `This action returns a #${id} minioStorage`;
  }

  update(id: number, updateMinioStorageDto: UpdateMinioStorageDto) {
    return `This action updates a #${id} minioStorage`;
  }

  remove(id: number) {
    return `This action removes a #${id} minioStorage`;
  }
}
