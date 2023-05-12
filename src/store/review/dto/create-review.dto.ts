import { Prisma } from '@prisma/client';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateReviewDto
  implements Partial<Prisma.ReviewUncheckedCreateInput>
{
  @IsNumber()
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  productId: number;

  @IsNumber()
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  rating: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  text?: string;
}
