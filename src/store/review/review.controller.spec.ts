import { Test, TestingModule } from '@nestjs/testing';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { initialData } from '../../seed/data/seed';
import { RoleIdWhere } from '../../user/interface/role-id-where';
import { Review, User } from '@prisma/client';
import { CreateReviewDto } from './dto/create-review.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdateReviewDto } from './dto/update-review.dto';

const fakeReviews = initialData.review;
const fakeUser = initialData.users[0];
const user: RoleIdWhere = { id: fakeUser.id, role: fakeUser.role };

describe('ReviewController', () => {
  let reviewController: ReviewController;
  let reviewServices: ReviewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [ReviewController],
      providers: [ReviewService],
    }).compile();

    reviewController = module.get<ReviewController>(ReviewController);
    reviewServices = module.get<ReviewService>(ReviewService);
  });

  describe('findAllReview', () => {
    it('should return an array of cats', async () => {
      const result = fakeReviews as any;
      jest
        .spyOn(reviewServices, 'findAllReviews')
        .mockImplementation(() => result);

      expect(await reviewController.findAllReview()).toBe(result);
    });
  });

  describe('findOneReview', () => {
    describe('when review with ID exists', () => {
      it('should return one review', async () => {
        const result = fakeReviews[0];
        jest
          .spyOn(reviewServices, 'findOneReview')
          .mockImplementation(() => result as unknown as Promise<Review>);
        expect(await reviewController.findOne(result.id)).toBe(result);
      });
    });
    describe('OtherWise', () => {
      it('should throw the "NotFoundException"', async () => {
        jest
          .spyOn(reviewServices, 'findOneReview')
          .mockResolvedValueOnce(undefined);
        try {
          await reviewController.findOne(fakeReviews[0].id);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(
            `Review with id: ${fakeReviews[0].id} not found`,
          );
        }
      });
    });
  });

  describe('createReview', () => {
    it('should return one review transactionCreateReview', async () => {
      const createReviewDto: CreateReviewDto = { ...fakeReviews[0] };
      jest
        .spyOn(reviewServices, 'transactionCreateReview')
        .mockImplementation(() => fakeReviews[0] as unknown as Promise<Review>);
      expect(
        await reviewController.createReview(createReviewDto, user as User),
      ).toBe(fakeReviews[0]);
    });
  });

  describe('update', () => {
    describe('when review with ID exists', () => {
      it('should update one review', async () => {
        const updateReviewDto: UpdateReviewDto = { text: fakeReviews[0].text };
        jest
          .spyOn(reviewServices, 'updateReview')
          .mockResolvedValueOnce(fakeReviews[0]);
        expect(
          await reviewController.update(
            fakeReviews[0].id,
            updateReviewDto,
            user as User,
          ),
        ).toBe(fakeReviews[0]);
      });
    });
    describe('OtherWise', () => {
      it('should throw the "NotFoundException"', async () => {
        const updateReviewDto: UpdateReviewDto = { text: fakeReviews[0].text };
        jest
          .spyOn(reviewServices, 'updateReview')
          .mockResolvedValueOnce(undefined);
        try {
          await reviewController.update(
            fakeReviews[0].id,
            updateReviewDto,
            user as User,
          );
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(
            `Review with id: ${fakeReviews[0].id} not found`,
          );
        }
      });
    });
  });

  describe('Remove', () => {
    describe('when review with ID exists', () => {
      it('should remove one review', async () => {
        jest
          .spyOn(reviewServices, 'removeReview')
          .mockImplementation(
            () => fakeReviews[0] as unknown as Promise<Review>,
          );
        expect(
          await reviewController.remove(fakeReviews[0].id, user as User),
        ).toBe(fakeReviews[0]);
      });
    });
    describe('OtherWise', () => {
      it('should throw the "NotFoundException"', async () => {
        jest.spyOn(reviewServices, 'removeReview').mockReturnValue(undefined);
        try {
          await reviewController.remove(fakeReviews[0].id, user as User);
        } catch (err) {
          expect(err).toBeInstanceOf(BadRequestException);
          expect(err.message).toEqual(
            `Review with id: ${fakeReviews[0].id} not found`,
          );
        }
      });
    });
  });
});
