import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
} from 'class-validator';

export class QueryColorImagesLimitDto {
  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  takeImage = 10;

  @IsOptional()
  @IsBoolean()
  colors = false;
}
