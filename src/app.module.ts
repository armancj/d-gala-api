import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';
import { PrismaModule } from './prisma/prisma.module';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        PORT: Joi.number().default(3000),
        SWAGGER_PREFIX: Joi.string().required(),
        GLOBAL_PREFIX: Joi.string().required(),
        DATABASE_URL: Joi.string().required(),
      }),
    }),
    UserModule,
    CommonModule,
    PrismaModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
