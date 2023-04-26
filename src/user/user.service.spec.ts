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

  it('should return data from Prisma', async () => {
    const result: User[] = initialData.users as User[];

    jest.spyOn(prisma.user, 'findMany').mockResolvedValueOnce(result);
    jest.spyOn(prisma.user, 'count').mockResolvedValueOnce(+result.length);

    const getAllResponseDto: GetAllResponseDto = {
      count: 0,
      result: initialData.users as User[],
      total: +initialData.users.length,
    };
    expect(await userService.findAll({ skip: 1, take: 10 })).toEqual(
      getAllResponseDto,
    );
  });

  /*describe('user', () => {
    it('should ', function () {
      const testUsers: User[] = initialData.users as User[];
      prisma.user.findMany.mockResolvedValueOnce<User>(testUsers);
      expect(userService.findAll({ skip: 1, take: 10 })).resolves.toBe(
        testUsers,
      );
    });
  });*/

  describe('findOneUser', () => {
    describe('when user with ID exists', () => {
      it('should return the user object', async () => {
        const userId = '1';
        const expectedUser = {};

        expect(userService).toBeDefined();
        //coffeeRepository.findOne.mockReturnValue(expectedCoffee);
        //const coffee = await service.findOne(+userId);
        //expect(coffee).toEqual(expectedUser);
      });
    });
    describe('otherwise', () => {
      it('Should throw the "NotFoundException"', async () => {
        const userId = '1';
        expect(userService).toBeDefined();
        //coffeeRepository.findOne.mockReturnValue(undefined);

        /*try {
          await service.findOne(+coffeeId);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(`Coffee #${coffeeId} not found`);
        }*/
      });
    });
  });
});
