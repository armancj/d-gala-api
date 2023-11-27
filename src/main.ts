import { NestFactory, Reflector, repl } from '@nestjs/core';
import { AppModule } from './app.module.js';
import {
  INestApplication,
  Logger,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import {
  DataResponseInterceptor,
  ExcludeNullInterceptor,
  TimeoutInterceptor,
} from './common/interceptors';
import { EnumEnvName } from './common/config';
import { AppSwagger } from './app.swagger';
import helmet from 'helmet';
import { LoggingInterceptor } from './logger/interceptor/loggin.interceptor';
import { importAdminModule } from './app.admin-module';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger(bootstrap.name);
  const configService = app.get(ConfigService);
  app.enableCors();

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
    defaultVersion: '1',
  });

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new DataResponseInterceptor(new Reflector()),
    new ExcludeNullInterceptor(),
    new TimeoutInterceptor(),
  );
  app.setGlobalPrefix(configService.get(EnumEnvName.GLOBAL_PREFIX));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  AppSwagger(app, configService);
  //app.use(helmet());

  app.use('/admin', await importAdminModule(app));
  const port = parseInt(configService.get(EnumEnvName.PORT), 10) || 3000;

  await repl(AppModule);
  await app.listen(port);
  logger.log(`App running at url: ${await app.getUrl()}`);

  //webpack
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap().then(() => console.log('Server executed successfully'));
