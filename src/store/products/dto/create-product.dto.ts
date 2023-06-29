import { GenderType } from '../enum/gender-type.enum';
import { ProductStatus } from '../enum/product-status.enum';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { stringReplaceUnderscore } from '../../../common/utils/check-slug-insert.function';

export class CreateProductDto {
  @IsString()
  @MaxLength(80)
  @MinLength(4)
  readonly name: string;

  @IsString()
  @MaxLength(255)
  @MinLength(4)
  readonly content: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsEnum(GenderType)
  readonly gender: GenderType;

  @IsArray()
  @IsOptional()
  @Transform(({ value }) => value?.map((tag) => stringReplaceUnderscore(tag)))
  @IsString({ each: true })
  readonly tags?: string[];

  @IsNumber()
  @Min(0)
  readonly stock: number;

  @IsEnum(ProductStatus)
  readonly status: ProductStatus;

  @IsNumber()
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  @IsOptional()
  categoryId?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  price: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  sizes: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  colors?: string[];
}
