import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReviewService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createReviewDto: CreateReviewDto) {
    //this.prismaService.review.create({ data: createReviewDto });
    return createReviewDto;
  }

  findAllReviews() {
    return this.prismaService.review.findMany();
  }

  async findOneReview(id: string) {
    return await this.prismaService.review
      .findUniqueOrThrow({ where: { id } })
      .catch(async (err) => {
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
