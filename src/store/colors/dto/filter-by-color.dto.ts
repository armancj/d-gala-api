import { IntersectionType } from '@nestjs/swagger';
import { GetAllQueryV2Dto } from '../../../common/dto/get-all-query-v2.dto';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class FilterByColorDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @IsInt()
  id?: number;

  @IsOptional()
  @IsString()
  hexadecimal?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @IsInt()
  productId?: number;

  @IsOptional()
  @IsString()
  url?: string;
}

export class SearchAndFilterDto extends IntersectionType(
  GetAllQueryV2Dto,
  FilterByColorDto,
) {}
