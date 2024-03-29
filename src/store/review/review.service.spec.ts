import { Test, TestingModule } from '@nestjs/testing';
import { ReviewService } from './review.service';
import { PrismaService } from '../../prisma/prisma.service';
import { initialData } from '../../seed/data/seed';
import { Prisma, Review } from '@prisma/client';
import { HttpStatus, NotFoundException } from '@nestjs/common';
import { v4 as uuid4 } from 'uuid';
import { RoleIdWhere } from '../../user/interface/role-id-where';

const fakeReviews = initialData.review;
const fakeUser = initialData.users[0];
const user: RoleIdWhere = { id: fakeUser.id, role: fakeUser.role };

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
    it('should transactionCreateReview review', async () => {
      const createReviewDto: Prisma.ReviewUncheckedCreateInput = {
        ...fakeReviews[0],
      };
      jest
        .spyOn(prismaService.review, 'create')
        .mockResolvedValueOnce(fakeReviews[0] as any);
      const result = await reviewService.transactionCreateReview(
        createReviewDto,
      );
      expect(result).toEqual(fakeReviews[0]);
    });
  });

  describe('updateReview', () => {
    describe('when review with ID exists', () => {
      it('should return updateReview', async () => {
        const reviewId = fakeReviews[0].id;
        jest
          .spyOn(prismaService.review, 'update')
          .mockResolvedValueOnce(fakeReviews[0]);
        const result = await reviewService.updateReview(
          reviewId,
          fakeReviews[0],
          user,
        );
        expect(result).toEqual(fakeReviews[0]);
      });
    });
    describe('OtherWise', () => {
      it('should throw the "NotFoundException"', async () => {
        const reviewId = fakeReviews[0].id;
        try {
          await reviewService.updateReview(reviewId, fakeReviews[0], user);
        } catch (e) {
          expect(e).toBeInstanceOf(NotFoundException);
          expect(e.message).toBe(`Review with id: ${reviewId} not found`);
        }
      });
    });
  });

  describe('removeReview', () => {
    describe('when review with ID exists', () => {
      it('should return removeReview', async () => {
        const reviewId = fakeReviews[0].id;
        jest
          .spyOn(prismaService.review, 'delete')
          .mockResolvedValueOnce(fakeReviews[0]);
        const result = await reviewService.removeReview(reviewId, user);
        expect(result).toBe(fakeReviews[0]);
      });
    });
    describe('OtherWise', () => {
      it('should throw the "NotFoundException" ', async () => {
        const reviewId = fakeReviews[0].id;
        jest
          .spyOn(prismaService.review, 'delete')
          .mockResolvedValueOnce(undefined);
        try {
          await reviewService.removeReview(reviewId, user);
        } catch (e) {
          expect(e).toBeInstanceOf(NotFoundException);
          expect(e.message).toEqual(`Review with id: ${reviewId} not found`);
        }
      });
    });
  });
});
