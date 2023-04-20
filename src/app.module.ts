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
import { JwtAuthGuard } from './authentication/guard';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './authentication/auth.module';
import { SearchModule } from './search/search.module';
import { ExceptionLoggerFilter } from './common/filter/exception-logger.filter';
import { CategoryModule } from './products/category/category.module';
import { SeedModule } from './seed/seed.module';
import { LoggerMiddleware } from './logger/midleware/logger.middleware';
import { ProductsModule } from './products/products.module';
import { MailerModule } from './mailer/mailer.module';
import { validationSchema } from './config/validation.schema';
import authConfig from './authentication/config/auth.config';
import searchConfig from './search/config/search.config';
import { FilesModule } from './files/files.module';
import { LoggerModule } from './logger/logger.module';

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
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
