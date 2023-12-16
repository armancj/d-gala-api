import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma, Role, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { HandlerError } from '../common/utils/handler-error';
import { GetAllResponseDto } from '../common/dto';
import { EnumUserRole } from './enum/user-role.enum';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { User as UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Users } from './entities/users.entity';

export interface FindAllUserParams {
  skip?: number;
  take?: number;
  user?: User;
}

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto, user?: User): Promise<User> {
    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash('12344567', salt);
    return await this.createUser({
      data: { ...createUserDto, password, salt } as User,
      select: this.getSelectUser(user?.role),
    });
  }

  async findAll(params: FindAllUserParams): Promise<GetAllResponseDto> {
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
      profile: { select: { photo: { select: { url: true } } } },
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
    const userData = await this.userWhereUnique({
      where: { id },
      select: {
        ...this.getSelectUser(user?.role),
        profile: { include: { photo: { select: { name: true, url: true } } } },
      },
    });
    return UserEntity.from(userData);
  }
  async findOneProfile(id: number, user?: User) {
    return await this.userWhereUnique({
      where: { id },
      select: {
        ...this.getSelectUser(user?.role),
        profile: { include: { photo: { select: { name: true, url: true } } } },
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto, user?: User) {
    let data: Prisma.UserUpdateArgs;
    if (user?.role === Role.ADMIN || user.role === Role.SUADMIN) {
      data = { where: { id }, data: { ...updateUserDto } };
    }
    if (user?.role === Role.WORKER || user.role === Role.USER) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { status, role, ...rest } = updateUserDto;
      data = { where: { id }, data: { ...rest } };
    }
    return this.updateUser(data);
  }

  async remove(id: number) {
    return UserEntity.from(
      await this.updateUser({ where: { id }, data: { deleted: true } }),
    );
  }

  async userWhereUnique(
    params: Prisma.UserFindUniqueOrThrowArgs,
  ): Promise<User | null> {
    return await this.prisma.user
      .findUniqueOrThrow(params)
      .catch((err) => HandlerError(err));
  }

  async userFindFirstArgs(params: Prisma.UserFindFirstArgsBase): Promise<User> {
    const user = await this.prisma.user
      .findFirstOrThrow(params)
      .catch((err) =>
        HandlerError(
          err,
          `The user not found in the Site. Please select a other user id`,
        ),
      );
    return UserEntity.from(user);
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
    return UserEntity.from(user);
  }

  async users(params: Prisma.UserFindManyArgs): Promise<GetAllResponseDto> {
    if (params?.take === -1) delete params.take;
    const data = (await this.prisma.user
      .findMany(params)
      .catch((err) => HandlerError(err))) as unknown as User[];
    const total = await this.prisma.user.count({ where: { deleted: false } });

    const result = Users.from(data).users;
    return { result, total };
  }

  async createUser(params: Prisma.UserCreateArgs): Promise<User> {
    if (params?.data?.email)
      params.data.email = params.data.email.toLowerCase();
    const user = await this.prisma.user
      .create(params)
      .catch((err) =>
        HandlerError(err, `Email. username or Phone is duplicated`),
      );
    return UserEntity.from(user);
  }

  async updateUser(params: Prisma.UserUpdateArgs): Promise<User> {
    await this.userWhereUniqueOrThrow({ where: params.where });
    const user = await this.prisma.user
      .update(params)
      .catch((err) =>
        HandlerError(err, `Email. username or Phone is duplicated`),
      );
    return UserEntity.from(user);
  }

  async deleteUser(params: Prisma.UserDeleteArgs): Promise<User> {
    const user = await this.prisma.user
      .delete(params)
      .catch((err) =>
        HandlerError(
          err,
          `The user not found in the Site. Please select a other user id`,
        ),
      );
    return UserEntity.from(user);
  }

  async findOneUserInit(su_admin: EnumUserRole.SUADMIN) {
    const user = await this.userFindFirstArgs({
      where: { role: su_admin },
    }).catch(() => null);
    if (user) throw new ConflictException(`Already have a user super admin`);
    return true;
  }

  async updateProfileUser(
    user: User,
    updateUserProfileDto: UpdateUserProfileDto,
  ) {
    const { bio, ...rest } = updateUserProfileDto;
    return await this.updateUser({
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
      },
    });
  }
}
