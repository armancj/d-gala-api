import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { ReviewService } from '../../src/store/review/review.service';
import { Test } from '@nestjs/testing';
import { ReviewModule } from '../../src/store/review/review.module';
import * as request from 'supertest';
import { initialData } from '../../src/seed/data/seed';
import { RoleIdWhere } from '../../src/user/interface/role-id-where';

const fakeReviews = initialData.review;
const fakeUser = initialData.users[0];
const user: RoleIdWhere = { id: fakeUser.id, role: fakeUser.role };

describe('[Feature] Reviews - /review', () => {
  let app: INestApplication;
  const reviewService = { findAllReview: () => fakeReviews };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ReviewModule],
    })
      .overrideProvider(ReviewService)
      .useValue(reviewService)
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    await app.init();
  });

  it(`/GET reviews`, () => {
    return request(app.getHttpServer())
      .get('/review')
      .expect(HttpStatus.OK)
      .expect({
        data: reviewService.findAllReview(),
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
