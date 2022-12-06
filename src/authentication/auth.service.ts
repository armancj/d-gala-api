import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

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
      select: this.userService.getSelectUser(),
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

  async validateUser(userName: string, pass: string): Promise<any> {
    const user = await this.userService.userFindFirstArgs({
      where: { OR: [{ userName }, { email: userName }] },
    });
    if (user && (await this.verifyPassword(pass, user?.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
