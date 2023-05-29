import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, Review, User } from '@prisma/client';
import { HandlerError } from '../../common/utils/handler-error';
import { EnumUserRole } from '../../user/enum/user-role.enum';
import { RoleIdWhere } from '../../user/interface/role-id-where';
import {
  ReviewTransactionInterface,
  ReviewTransactionUpdate,
} from './interface/review-transaction.interface';

@Injectable()
export class ReviewService {
  constructor(private readonly prismaService: PrismaService) {}

  async transactionCreateReview(
    createReviewDto: Prisma.ReviewUncheckedCreateInput,
  ) {
    return await this.prismaService.$transaction(async (prisma) => {
      const review = await this.createReview({ prisma }, createReviewDto);
      await this.updateProductReviewsTotal({
        prisma,
        productId: review.productId,
      });
      return review;
    });
  }

  private async createReview(
    params: Partial<ReviewTransactionInterface>,
    createReviewDto: Prisma.ReviewUncheckedCreateInput,
  ) {
    const { prisma } = params;
    return await prisma.review
      .create({
        data: createReviewDto,
      })
      .catch((err) => {
        HandlerError(
          err,
          `User with id: ${createReviewDto.userId} he have a create review`,
        );
      });
  }

  private async updateProductReviewsTotal(params: ReviewTransactionInterface) {
    const { prisma, productId } = params;
    const reviewsAvg = await prisma.review.aggregate({
      _avg: { rating: true },
      where: { productId },
    });
    await prisma.product.update({
      where: { id: productId },
      data: { reviewsTotal: Math.round(reviewsAvg._avg.rating) },
    });
  }

  findAllReviews() {
    return this.prismaService.review.findMany();
  }

  async findOneReview(id: string) {
    return await this.prismaService.review
      .findUniqueOrThrow({ where: { id } })
      .catch(async () => {
        throw new NotFoundException(`Review with id: ${id} not found`);
      });
  }

  updateReview(params: ReviewTransactionUpdate) {
    const { prisma, updateReviewDto, user, id } = params;
    const updateReview: Prisma.ReviewUncheckedUpdateWithoutProductInput = {
      ...updateReviewDto,
    };
    const whereReview: Prisma.ReviewWhereUniqueInput =
      user.role === EnumUserRole.USER ? { id, userId: user.id } : { id };

    return prisma.review
      .update({
        where: whereReview,
        data: updateReview,
      })
      .catch(() => {
        throw new NotFoundException(`Review with id: ${id} not found`);
      });
  }

  removeReview(id: string, user: RoleIdWhere): Promise<Review> {
    const where: Prisma.ReviewWhereUniqueInput =
      user.role !== EnumUserRole.USER ? { id } : { userId: user.id };
    return this.prismaService.review.delete({ where }).catch(() => {
      throw new NotFoundException(`Review with id: ${id} not found`);
    });
  }

  transactionUpdateReview(
    id: string,
    updateReviewDto: UpdateReviewDto,
    user: User,
  ) {
    return this.prismaService.$transaction(async (prisma) => {
      const review = await this.updateReview({
        prisma,
        updateReviewDto,
        user,
        id,
      });
      await this.updateProductReviewsTotal({
        prisma,
        productId: review.productId,
      });
      return review;
    });
  }
}
