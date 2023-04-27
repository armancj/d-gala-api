import { GenderType } from '../enum/gender-type.enum';
import { ProductStatus } from '../enum/product-status.enum';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
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
  @MaxLength(80)
  @MinLength(4)
  slug?: string;

  @IsEnum(GenderType)
  readonly gender: GenderType;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  readonly tags?: string[];

  @IsNumber()
  @Min(0)
  readonly stock: number;

  @IsEnum(ProductStatus)
  readonly status: ProductStatus;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  categoryName?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  price: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  sizes: string[];
}
