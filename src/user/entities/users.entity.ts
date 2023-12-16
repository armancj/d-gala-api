import { User } from './user.entity';
import { User as UsersEntity } from '@prisma/client';
export class Users {
  readonly users: Partial<User>[];
  constructor(users: Partial<UsersEntity[]>) {
    this.users = users.map((user) => User.from(user));
  }

  static from(users: Partial<UsersEntity[]>): Users {
    return new Users(users);
  }
}
