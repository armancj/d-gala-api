import { GenderType } from '../enum/gender-type.enum';
import { ProductStatus } from '../enum/product-status.enum';
import {
  IsArray,
  IsEnum,
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
  @MaxLength(80)
  @MinLength(4)
  readonly slug: string;

  @IsEnum(GenderType)
  readonly gender: GenderType;

  @IsArray()
  @IsString({ each: true })
  readonly tags: string[];

  @IsNumber()
  @Min(0)
  readonly stock: number;

  @IsEnum(ProductStatus)
  readonly status: ProductStatus;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  readonly categoryId: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  price: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  sizes: string[];
}
