import { Test, TestingModule } from '@nestjs/testing';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { initialData } from '../../seed/data/seed';
import { RoleIdWhere } from '../../user/interface/role-id-where';

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
});
