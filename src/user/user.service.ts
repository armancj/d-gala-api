import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UserPayload } from './interface/user-payload';
import { HandlerError } from '../common/utils/handler-error';
import { GetAllResponseDto } from '../common/dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async create(
    createUserDto: CreateUserDto,
    user?: UserPayload,
  ): Promise<User | void> {
    return await this.prisma.user
      .create({ data: { ...createUserDto } })
      .catch((err) =>
        HandlerError(err, `Email. username or Phone is duplicated`),
      );
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<GetAllResponseDto> {
    const { skip, cursor, where, orderBy } = params;
    const take = params.take === -1 ? undefined : params.take;
    const total = await this.prisma.user.count();
    const data = await this.prisma.user
      .findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
      })
      .catch((err) => HandlerError(err));
    return {
      data,
      count: (data as User[]).length || 0,
      total,
    };
  }

  async findOne(
    UserWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | void> {
    return this.prisma.user
      .findUnique({
        where: UserWhereUniqueInput,
      })
      .catch((err) => HandlerError(err));
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
