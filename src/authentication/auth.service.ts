import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserPayload } from '../user/interface/user-payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  public async register(registrationData: RegisterUserDto) {
    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash(registrationData.password, salt);
    return await this.userService.createUser({
      data: { ...registrationData, password, salt },
      select: this.userService.getSelectUser(registrationData?.role),
    });
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isMatch = await bcrypt.compare(plainTextPassword, hashedPassword);
    if (isMatch) return true;
    return null;
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.userFindFirstArgs({
      where: {
        OR: [{ username: username }, { email: username }, { phone: username }],
      },
    });
    if (user && (await this.verifyPassword(pass, user?.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, salt, deleted, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: UserPayload) {
    const payload: UserPayload = {
      ...user,
    };
    return {
      payload,
      access_token: this.jwtService.sign(payload),
    };
  }
}
