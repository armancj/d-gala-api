import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import { EnumEnvName } from './common/config';
import { AppSwagger } from './app.swagger';
import helmet from 'helmet';
import { ExcludeNullInterceptor } from './common/interceptors/exclude-null.interceptor';
import { LoggingInterceptor } from './common/interceptors/loggin.interceptor';

declare const module: any;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger(bootstrap.name);
  const configService = app.get(ConfigService);

  app.enableCors();
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(
    new ExcludeNullInterceptor(),
    new LoggingInterceptor(),
  );
  app.setGlobalPrefix(configService.get(EnumEnvName.GLOBAL_PREFIX));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
      enableDebugMessages: true,
    }),
  );
  app.use(helmet());
  AppSwagger(app, configService);

  const port = parseInt(configService.get(EnumEnvName.PORT), 10) || 3000;
  await app.listen(port);
  logger.log(`App running at url: ${await app.getUrl()}`);

  //webpack
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap().then(() => console.log('Server executed successfully'));
