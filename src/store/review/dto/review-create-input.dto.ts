import { Prisma } from '@prisma/client';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class ReviewCreateInputDto implements Prisma.ReviewCreateInput {
  @IsNumber()
  @IsPositive()
  @IsInt()
  rating: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  text?: string;

  product: Prisma.ProductCreateNestedOneWithoutReviewsInput;
  user: Prisma.UserCreateNestedOneWithoutReviewInput;
}
