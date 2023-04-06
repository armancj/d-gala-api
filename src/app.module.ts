import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
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
import { LoggerMiddleware } from './common/midleware/logger.middleware';
import { validationSchema } from './config/validation.schema';
import { SeedModule } from './seed/seed.module';
import { ProductsModule } from './products/products.module';
import authConfig from './authentication/config/auth.config';
import searchConfig from './search/config/search.config';
import { EmailModule } from './email/email.module';

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
    //MinioStorageModule,
    ProductsModule,
    EmailModule,
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
      .forRoutes({ path: 'category', method: RequestMethod.GET });
  }
}
