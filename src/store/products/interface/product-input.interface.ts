import { User, Prisma } from '@prisma/client';
import { CreateProductDto } from '../dto';
import { OmitType } from '@nestjs/mapped-types';

export interface ProductInput {
  user: User;
  rest: Omit<CreateProductDto, 'categoryId' | 'tags'>;
  categoryId?: number;
}
