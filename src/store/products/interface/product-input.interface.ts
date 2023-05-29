import { User } from '@prisma/client';
import { CreateProductDto } from '../dto';

export interface ProductInput {
  user: User;
  rest: Omit<CreateProductDto, 'categoryId' | 'tags'>;
  categoryId?: number;
}
