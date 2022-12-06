import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt/dist/interfaces/jwt-module-options.interface';

export default registerAs('auth', () => {
  const dataJwt: JwtModuleOptions = {
    secret: `${process.env.JWT_SECRET_KEY}`,
    signOptions: { expiresIn: '60d' },
  };
  return dataJwt;
});
