import { NestFactory, repl } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/loggin.interceptor';
import { EnumEnvName } from './common/config';
import { AppSwagger } from './app.swagger';
import { DataResponseInterceptor } from './common/interceptors/data_response.interceptor';
import { ExcludeNullInterceptor } from './common/interceptors/exclude-null.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import helmet from 'helmet';

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
    new DataResponseInterceptor(),
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
  app.use(helmet());
  AppSwagger(app, configService);

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
