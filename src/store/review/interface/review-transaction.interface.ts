import { PrismaService } from '../../../prisma/prisma.service';
import {UpdateReviewDto} from "../dto/update-review.dto";
import {RoleIdWhere} from "../../../user/interface/role-id-where";

export interface ReviewTransactionInterface {
  prisma: Omit<
    PrismaService,
    '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'
  >;
  productId: number;
}

export interface ReviewTransactionUpdate {
  prisma: Omit<
    PrismaService,
    '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'
  >;
  id: string;
  updateReviewDto: UpdateReviewDto;
  user: RoleIdWhere;
}
