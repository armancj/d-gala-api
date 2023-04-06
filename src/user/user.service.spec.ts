import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

describe('UserService', () => {
  let service: UserService;
  let createMockRepository: jest.Mock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: { createMock: createMockRepository },
          },
        },
      ],
    }).compile();
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('when the getByEmail function is called', () => {
    describe('and the findUnique method returns the user', () => {
      let user: Partial<User>;
      user = {
        currentHashedRefreshToken: 'sdfdfdsfddsafdafds',
        email: 'sadsad@sdasdsad.com',
        firstname: 'asdsad',
        id: 1,
        lastname: 'asdsad',
        password: 'sadsadsadsad131321',
        phone: '55267091',
        salt: 'sdsdsdsd',
        username: 'asdsd',
      };
      const { id, ...rest } = user;
      it('should return the user', async () => {
        const result = await service.createUser({
          data: {
            ...rest,
          },
        });
        expect(result).toBe(user);
      });
    });
  });
});
