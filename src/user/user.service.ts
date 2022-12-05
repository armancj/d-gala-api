import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma, Role, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UserPayload } from './interface/user-payload';
import { HandlerError } from '../common/utils/handler-error';
import { GetAllResponseDto } from '../common/dto';
import { UserResponse } from "./interface/user.response";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async create(
    createUserDto: CreateUserDto,
    user?: UserPayload,
  ): Promise<User> {
    return await this.createUser({
      data: { ...createUserDto },
      select: this.getSelectUser(user),
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    user?: UserPayload;
  }): Promise<GetAllResponseDto> {
    const { skip, take, user } = params;
    return await this.users({
      take,
      skip,
      select: this.getSelectUser(user),
      where: { deleted: false },
    });
  }

  private getSelectUser(user?: UserPayload) {
    if (user?.role === Role.ADMIN || Role.SUADMIN) return undefined;
    return {
      id: true,
      createdAt: true,
      email: true,
      userName: true,
      firstName: true,
      lastName: true,
      phone: true,
      role: true,
    };
  }

  async findOne(id: number, user?: UserPayload): Promise<User> {
    return await this.userWhereUniqueOrThrow({
      where: { id },
      select: this.getSelectUser(user),
    });
  }

  update(id: number, updateUserDto: UpdateUserDto, user?: UserPayload) {
    let data: Prisma.UserUpdateArgs;
    if (user?.role === Role.ADMIN || user.role === Role.SUADMIN) {
      data = { where: { id }, data: { ...updateUserDto } };
    }
    if (user?.role === Role.WORKER || user.role === Role.USER) {
      const { status, role, ...rest } = updateUserDto;
      data = { where: { id }, data: { ...rest } };
    }
    data = { where: { id }, data: { ...updateUserDto } };
    return this.prisma.user.update(data);
  }

  remove(id: number) {
    return this.updateUser({ where: { id }, data: { deleted: true } });
  }

  async userWhereUnique(
    params: Prisma.UserFindUniqueArgs,
  ): Promise<User | null> {
    return this.prisma.user.findUnique(params);
  }

  async userWhereUniqueOrThrow(
    params: Prisma.UserFindUniqueOrThrowArgs,
  ): Promise<User> {
    const user = await this.prisma.user
      .findUniqueOrThrow(params)
      .catch((err) =>
        HandlerError(
          err,
          `The user not found in the Site. Please select a other user id`,
        ),
      );
    return user as User;
  }

  async users(params: Prisma.UserFindManyArgs): Promise<GetAllResponseDto> {
    if (params?.take === -1) delete params.take;
    const data = (await this.prisma.user
      .findMany(params)
      .catch((err) => HandlerError(err))) as unknown as User[];
    const total = await this.prisma.user.count({ where: { deleted: false } });
    const count = data.length;
    return { data, count, total };
  }

  async createUser(params: Prisma.UserCreateArgs): Promise<User> {
    return (await this.prisma.user
      .create(params)
      .catch((err) =>
        HandlerError(err, `Email. username or Phone is duplicated`),
      )) as unknown as Promise<User>;
  }

  async updateUser(params: Prisma.UserUpdateArgs): Promise<User> {
    return (await this.prisma.user
      .update(params)
      .catch((err) =>
        HandlerError(err, `Email. username or Phone is duplicated`),
      )) as unknown as Promise<User>;
  }

  async deleteUser(params: Prisma.UserDeleteArgs): Promise<User> {
    return this.prisma.user
      .delete(params)
      .catch((err) =>
        HandlerError(
          err,
          `The user not found in the Site. Please select a other user id`,
        ),
      ) as unknown as User;
  }
}
