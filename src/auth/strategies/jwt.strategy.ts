import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserPayload } from '../../user/interface/user-payload';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }

  async validate(payloadAny: UserPayload) {
    const user = await this.userService
      .findOne(payloadAny.id)
      .catch((err) => null);
    if (!user) throw new UnauthorizedException('Unauthorized');

    const payload: UserPayload = {
      createdAt: user.createdAt,
      email: user.email,
      firstname: user.firstname,
      id: user.id,
      lastname: user.lastname,
      phone: user.phone,
      role: user.role,
      status: user.status,
      username: user.username,
      avatar: user.avatar,
    };
    return { ...payload };
  }
}
