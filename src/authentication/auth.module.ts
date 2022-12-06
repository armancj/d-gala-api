import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt/dist/interfaces/jwt-module-options.interface';
import { EnumEnvAuth } from './config/env-auth.enum';
import { LocalStrategy, JwtStrategy } from './strategies';

@Module({
  imports: [
    UserModule,
    PassportModule.register({ session: true }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        config.get<JwtModuleOptions>(EnumEnvAuth.APP_CONFIG_AUTH),
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
