import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { HandlerError } from '../../common/utils/handler-error';

@Injectable()
export class ReviewService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createReviewDto: CreateReviewDto) {
    return 'This action adds a new review';
  }

  findAllReviews() {
    return this.prismaService.review.findMany();
  }

  async findOneReview(id: string) {
    return this.prismaService.review
      .findUniqueOrThrow({ where: { id } })
      .catch((err) => {
        HandlerError(err.message);
      });
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  remove(id: number) {
    return `This action removes a #${id} review`;
  }
}
