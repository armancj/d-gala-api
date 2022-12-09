import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';
import { PrismaModule } from './prisma/prisma.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './authentication/auth.module';
import { SearchModule } from './search/search.module';
import { JwtAuthGuard, RolesGuard } from './authentication/guard';
import { ExceptionLoggerFilter } from './common/filter/exception-logger.filter';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import authConfig from './authentication/config/auth.config';
import searchConfig from './search/config/search.config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [authConfig, searchConfig],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        PORT: Joi.number().default(3000),
        SWAGGER_PREFIX: Joi.string().required(),
        GLOBAL_PREFIX: Joi.string().required(),
        DATABASE_URL: Joi.string().required(),
        JWT_SECRET_KEY: Joi.string().required(),
        JWT_SECRET_REFRESH_KEY: Joi.string().required(),
        JWT_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        JWT_TOKEN_REFRESH_EXPIRATION_TIME: Joi.string().required(),
        ELASTIC_SEARCH_NODE: Joi.string().required(),
        ELASTIC_SEARCH_USERNAME: Joi.string().required(),
        ELASTIC_SEARCH_PASSWORD: Joi.string().required(),
        ELASTIC_SEARCH_NAME: Joi.string().required(),
      }),
    }),
    UserModule,
    CommonModule,
    PrismaModule,
    PostsModule,
    AuthModule,
    SearchModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: ExceptionLoggerFilter,
    },
  ],
})
export class AppModule {}
