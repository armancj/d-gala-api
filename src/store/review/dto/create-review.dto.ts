import { Prisma } from '@prisma/client';
import { OmitType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { ReviewCreateInputDto } from './review-create-input.dto';
import { isInt, IsNotEmpty, isNumber, isPositive } from 'class-validator';
import { BadRequestException } from '@nestjs/common';

export class CreateReviewDto extends OmitType(ReviewCreateInputDto, [
  'product',
  'user',
] as const) {
  @Transform(({ value }) => connect(value))
  @IsNotEmpty()
  product: number;
}

function connect(id: number): Prisma.ProductCreateNestedOneWithoutReviewsInput {
  const message = [];
  if (!isNumber(id)) {
    message.push(
      'product must be a number conforming to the specified constraints',
    );
  }
  if (!isPositive(id)) {
    message.push('product must be a positive number');
  }

  if (!isInt(id)) {
    message.push('product must be an integer number');
  }

  if (message.length > 0) throw new BadRequestException(message);

  return { connect: { id } };
}
