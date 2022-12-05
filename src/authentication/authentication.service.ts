import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthenticationService {
  constructor(private readonly userService: UserService) {}
  public async register(registrationData: RegisterUserDto) {
    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash(registrationData.password, salt);
    return await this.userService.createUser({
      data: { ...registrationData, password, salt },
      select: this.userService.getSelectUser(),
    });
  }
  async getAuthenticatedUser(email: string, hashedPassword: string) {
    const user = await this.userService.userFindFirstArgs({
      where: {
        OR: [
          { email, deleted: false },
          { userName: email, deleted: false },
        ],
      },
    });
    if (!user) throw new BadRequestException(`Wrong credentials provided`);

    await this.verifyPassword(hashedPassword, user.password);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, salt, deleted, ...rest } = user;
    return rest;
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isMatch = await bcrypt.compare(plainTextPassword, hashedPassword);
    if (!isMatch) {
      throw new BadRequestException(`Wrong credentials provided`);
    }
  }
}
