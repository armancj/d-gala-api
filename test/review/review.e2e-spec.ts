import { INestApplication } from '@nestjs/common';
import { ReviewService } from '../../src/store/review/review.service';
import { Test } from '@nestjs/testing';
import { ReviewModule } from '../../src/store/review/review.module';
import * as request from 'supertest';

describe('[Feature] Reviews - /review', () => {
  let app: INestApplication;
  const reviewService = { findAllReview: () => ['test'] };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ReviewModule],
    })
      .overrideProvider(ReviewService)
      .useValue(reviewService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/GET reviews`, () => {
    return request(app.getHttpServer()).get('/review').expect(200).expect({
      data: reviewService.findAllReview(),
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
