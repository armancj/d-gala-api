import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { HandlerError } from '../../common/utils/handler-error';
import { EnumUserRole } from '../../user/enum/user-role.enum';
import { RoleIdWhere } from '../../user/interface/role-id-where';

@Injectable()
export class ReviewService {
  constructor(private readonly prismaService: PrismaService) {}

  async createReview(createReviewDto: Prisma.ReviewUncheckedCreateInput) {
    return this.prismaService.review
      .create({
        data: createReviewDto,
      })
      .catch((err) => {
        HandlerError(
          err,
          `User with id: ${createReviewDto.userId} is duplicated`,
        );
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

  updateReview(
    id: string,
    updateReviewDto: UpdateReviewDto,
    user: RoleIdWhere,
  ) {
    const updateReview: Prisma.ReviewUncheckedUpdateWithoutProductInput = {
      ...updateReviewDto,
    };
    const whereReview: Prisma.ReviewWhereUniqueInput =
      user.role === EnumUserRole.USER ? { id, userId: user.id } : { id };

    return this.prismaService.review
      .update({
        where: whereReview,
        data: updateReview,
      })
      .catch((err) => {
        HandlerError(err, 'error not found');
        //throw new NotFoundException('...err');
      });
  }

  remove(id: number) {
    return `This action removes a #${id} review`;
  }
}
