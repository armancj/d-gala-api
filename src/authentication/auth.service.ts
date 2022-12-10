import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserPayload } from '../user/interface/user-payload';
import { ConfigService } from '@nestjs/config';
import { EnumEnvAuth } from './config/env-auth.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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
      const { password, salt, deleted, currentHashedRefreshToken, ...result } = user;
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
      refresh_Token: await this.getRefreshToken(user),
    };
  }

  async getRefreshToken(user: UserPayload) {
    const payload = { id: user.id };
    const refreshToken = this.jwtService.sign(payload, {
      secret: `${this.configService.get<string>(
        EnumEnvAuth.JWT_SECRET_REFRESH_KEY,
      )}`,
      expiresIn: `${this.configService.get<string>(
        EnumEnvAuth.JWT_TOKEN_REFRESH_EXPIRATION_TIME,
      )}`,
    });
    await this.setCurrentRefreshToken(refreshToken, user.id);
    return refreshToken;
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const salt = await bcrypt.genSalt();
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, salt);
    await this.userService.updateUser({
      where: { id: userId },
      data: { currentHashedRefreshToken },
    });
  }
}
