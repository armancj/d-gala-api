import { Prisma } from '@prisma/client';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString, Max, Min,
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
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  text?: string;
}
