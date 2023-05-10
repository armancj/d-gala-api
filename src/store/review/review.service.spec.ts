import { Test, TestingModule } from '@nestjs/testing';
import { ReviewService } from './review.service';
import { PrismaService } from '../../prisma/prisma.service';
import { initialData } from '../../seed/data/seed';
import { Prisma, Review } from '@prisma/client';

const fakeReviews = initialData.review;

describe('ReviewService', () => {
  let reviewService: ReviewService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReviewService, PrismaService],
    }).compile();

    reviewService = module.get<ReviewService>(ReviewService);
    prismaService = await module.get<PrismaService>(PrismaService);
  });

  describe('findAllReviews', () => {
    it('should return all reviews', async () => {
      jest
        .spyOn(prismaService.review, 'findMany')
        .mockImplementation(
          () => fakeReviews as unknown as Prisma.PrismaPromise<Review[]>,
        );
      const result = await reviewService.findAllReviews();
      expect(result).toEqual(fakeReviews);
    });
  });

  describe('findOneReview', () => {
    describe('when review with ID exists', () => {
      it('should return the review object', async () => {
        jest
          .spyOn(prismaService.review, 'findUniqueOrThrow')
          .mockImplementationOnce(
            () => fakeReviews[0] as unknown as Promise<Review, never>,
          );
      });
    });
  });
});
