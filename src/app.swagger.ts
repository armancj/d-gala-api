import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { ENUM_ENV_NAME } from './common/config/ENUM_ENV_NAME';

export function AppSwagger(
  app: INestApplication,
  configService: ConfigService,
) {
  const config = new DocumentBuilder()
    .setTitle('D Gala - API Documentation')
    .setDescription('The documentation D Gala')
    .setVersion('0.1')
    .addTag('D Gala Documentation')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(
    configService.get(ENUM_ENV_NAME.SWAGGER_PREFIX),
    app,
    document,
  );
}
