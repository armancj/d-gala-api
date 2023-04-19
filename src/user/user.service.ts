import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma, Role, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { HandlerError } from '../common/utils/handler-error';
import { GetAllResponseDto } from '../common/dto';
import { EnumUserRole } from './enum/user-role.enum';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto, user?: User): Promise<User> {
    return await this.createUser({
      data: { ...createUserDto, password: '12344567' } as User,
      select: this.getSelectUser(user?.role),
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    user?: User;
  }): Promise<GetAllResponseDto> {
    const { skip, take, user } = params;
    return await this.users({
      take,
      skip,
      select: this.getSelectUser(user?.role),
      where: { deleted: false },
    });
  }

  getSelectUser(role?: string) {
    const data: Prisma.UserSelect = {
      id: true,
      createdAt: true,
      email: true,
      username: true,
      firstname: true,
      lastname: true,
      phone: true,
      role: true,
      status: true,
    };
    if (role && [Role.ADMIN, Role.SUADMIN].includes(role as any)) {
      return {
        ...data,
        deleted: true,
        currentHashedRefreshToken: true,
      };
    }
    return data;
  }

  async findOne(id: number, user?: User) {
    return await this.userWhereUnique({
      where: { id },
      select: {
        ...this.getSelectUser(user?.role),
        profile: { include: { photo: { select: { name: true, url: true } } } },
      },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto, user?: User) {
    let data: Prisma.UserUpdateArgs;
    if (user?.role === Role.ADMIN || user.role === Role.SUADMIN) {
      data = { where: { id }, data: { ...updateUserDto } as User };
    }
    if (user?.role === Role.WORKER || user.role === Role.USER) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { status, role, ...rest } = updateUserDto;
      data = { where: { id }, data: { ...rest } as User };
    }
    return this.prisma.user.update(data);
  }

  remove(id: number) {
    return this.updateUser({ where: { id }, data: { deleted: true } });
  }

  async userWhereUnique(
    params: Prisma.UserFindUniqueOrThrowArgs,
  ): Promise<User | null> {
    return this.prisma.user
      .findUniqueOrThrow(params)
      .catch((err) => HandlerError(err));
  }

  async userFindFirstArgs(
    params: Prisma.UserFindFirstArgsBase,
  ): Promise<User | void> {
    return await this.prisma.user
      .findFirst(params)
      .catch((err) =>
        HandlerError(
          err,
          `The user not found in the Site. Please select a other user id`,
        ),
      );
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
    return { result: data, total };
  }

  async createUser(params: Prisma.UserCreateArgs): Promise<User> {
    if (params?.data?.email)
      params.data.email = params.data.email.toLowerCase();
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

  async findOneUserInit(su_admin: EnumUserRole.SUADMIN) {
    const user = await this.userFindFirstArgs({ where: { role: su_admin } });
    if (user) throw new ConflictException(`Already have a user super admin`);
    return true;
  }

  updateProfileUser(user: User, updateUserProfileDto: UpdateUserProfileDto) {
    const { bio, ...rest } = updateUserProfileDto;
    return this.updateUser({
      where: { id: user.id },
      select: {
        ...this.getSelectUser(user?.role),
        profile: { select: { bio: true } },
      },
      data: {
        ...rest,
        profile: {
          upsert: { create: { bio }, update: { bio } },
        },
      } as unknown as User,
    });
  }
}
