import { Test, TestingModule } from '@nestjs/testing';
import { ReviewService } from './review.service';
import { PrismaService } from '../../prisma/prisma.service';
import { initialData } from '../../seed/data/seed';
import { Prisma, Review } from '@prisma/client';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { v4 as uuid4 } from 'uuid';
import { HandlerError } from '../../common/utils/handler-error';
import { error } from 'winston';
import { CreateReviewDto } from './dto/create-review.dto';

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
          .mockResolvedValueOnce(fakeReviews[0]);
        const id = '3842ca28-2aea-11e8-8fec-a860b60304d5';
        const result = await reviewService.findOneReview(id);
        expect(result).toEqual(fakeReviews[0]);
      });
    });
    describe('OtherWise', () => {
      it('should throw the "NotFoundException"', async () => {
        jest
          .spyOn(prismaService.review, 'findUniqueOrThrow')
          .mockRejectedValue(null);
        const id = uuid4();
        try {
          await reviewService.findOneReview(id);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
          expect(error.message).toEqual(`Review with id: ${id} not found`);
          expect(error.getStatus()).toEqual(HttpStatus.NOT_FOUND);
        }
      });
    });
  });

  describe('createReview', () => {
    it('should create review', () => {
      const createReviewDto: CreateReviewDto = {
        product: 1,
        rating: 2,
        text: 'sad',
      };
      const result = reviewService.create(createReviewDto);
      expect(result).toEqual(createReviewDto);
    });
  });
});
