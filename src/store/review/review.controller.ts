import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ApiTags } from '@nestjs/swagger';
import { GetUser } from '../../auth/decorator';
import { Review, User } from '@prisma/client';

@ApiTags('Reviews')
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  createReview(
    @Body() createReviewDto: CreateReviewDto,
    @GetUser() user: User,
  ) {
    return this.reviewService.transactionCreateReview({
      ...createReviewDto,
      userId: user.id,
    });
  }

  @Get()
  findAllReview(): Promise<Review[]> {
    return this.reviewService.findAllReviews();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.reviewService.findOneReview(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @GetUser() user: User,
  ) {
    return this.reviewService.transactionUpdateReview(
      id,
      updateReviewDto,
      user,
    );
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.reviewService.transactionRemoveReview(id, user);
  }
}
