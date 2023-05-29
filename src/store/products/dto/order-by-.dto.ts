import { Prisma } from '@prisma/client';
import { IsOptional } from 'class-validator';

export class OrderByDto {
  @IsOptional()
  orderBy?: Prisma.Enumerable<Prisma.ProductOrderByWithRelationInput>;
}
