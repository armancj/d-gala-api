import { Role, UserStatus, User as Users } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class User implements Users {
  readonly id: number;
  readonly email: string;
  readonly phone: string;
  readonly username: string;
  readonly firstname: string;
  readonly lastname: string;
  readonly avatar?: string;
  readonly role: Role;
  readonly status: UserStatus;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  @Exclude()
  readonly password: string;

  @Exclude()
  readonly salt: string;

  @Exclude()
  readonly deleted: boolean;

  @Exclude()
  readonly currentHashedRefreshToken: string;

  constructor(user: Partial<Users>) {
    const { profile, ...rest } = user as any;
    Object.assign(this, rest);

    if (profile?.photo?.url) {
      this.avatar = profile.photo.url;
    }
  }

  static from(user: Partial<Users>): User {
    return new User(user);
  }
}
