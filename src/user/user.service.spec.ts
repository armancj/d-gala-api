import { UserService } from './user.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClient, User } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { initialData } from '../seed/data/seed';
import { GetAllResponseDto } from '../common/dto';

describe('UserService', () => {
  let userService: UserService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    userService = module.get<UserService>(UserService);
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });
});
