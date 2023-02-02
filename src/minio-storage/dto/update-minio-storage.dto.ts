import { PartialType } from '@nestjs/swagger';
import { CreateMinioStorageDto } from './create-minio-storage.dto';

export class UpdateMinioStorageDto extends PartialType(CreateMinioStorageDto) {}
