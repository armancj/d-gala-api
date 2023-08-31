import { Prisma } from '@prisma/client';
import {
  IsHexColor,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
} from 'class-validator';

export class CreateColorDto implements Prisma.ColorsUncheckedCreateInput {
  @IsHexColor()
  @IsNotEmpty()
  hexadecimal: string;

  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  @IsInt()
  productId: number;
}
