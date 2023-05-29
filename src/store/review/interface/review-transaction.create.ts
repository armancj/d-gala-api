import { PrismaService } from '../../../prisma/prisma.service';
import { UpdateReviewDto } from '../dto/update-review.dto';
import { RoleIdWhere } from '../../../user/interface/role-id-where';

export interface prismaTransaction {
  prisma: Omit<
    PrismaService,
    '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'
  >;
}

export interface ReviewTransactionCreate extends prismaTransaction {
  productId: number;
}

export interface ReviewTransactionUpdate extends prismaTransaction {
  id: string;
  updateReviewDto: UpdateReviewDto;
  user: RoleIdWhere;
}

export interface ReviewTransactionRemove extends prismaTransaction {
  id: string;
  user: RoleIdWhere;
}
