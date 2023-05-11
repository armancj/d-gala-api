import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { join } from 'path';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthGuard } from './auth/guard';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';
import { PostsModule } from './store/posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { SearchModule } from './store/search/search.module';
import { ExceptionLoggerFilter } from './common/filter/exception-logger.filter';
import { CategoryModule } from './store/category/category.module';
import { SeedModule } from './seed/seed.module';
import { LoggerMiddleware } from './logger/midleware/logger.middleware';
import { ProductsModule } from './store/products/products.module';
import { MailerModule } from './mailer/mailer.module';
import { validationSchema } from './config/validation.schema';
import authConfig from './auth/config/auth.config';
import searchConfig from './store/search/config/search.config';
import { FilesModule } from './files/files.module';
import { LoggerModule } from './logger/logger.module';
import { ReviewModule } from './store/review/review.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [authConfig, searchConfig],
      validationSchema,
    }),
    UserModule,
    CommonModule,
    PrismaModule,
    PostsModule,
    AuthModule,
    SearchModule,
    CategoryModule,
    SeedModule,
    ProductsModule,
    MailerModule,
    FilesModule,
    LoggerModule,
    ReviewModule,
  ],
  controllers: [AppController],
  providers: [
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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .exclude({ path: 'logger', method: RequestMethod.ALL, version: '1' })
      .exclude({ path: 'seed', method: RequestMethod.GET, version: '1' })
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
