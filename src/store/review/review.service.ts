import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { HandlerError } from '../../common/utils/handler-error';

@Injectable()
export class ReviewService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createReviewDto: Prisma.ReviewUncheckedCreateInput) {
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

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  remove(id: number) {
    return `This action removes a #${id} review`;
  }
}
