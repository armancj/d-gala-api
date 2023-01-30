import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { EnumEnvName } from './common/config';

export function Swagger(app: INestApplication, configService: ConfigService) {
  const config = new DocumentBuilder()
    .setTitle('D Gala - API Documentation')
    .setDescription('The documentation D Gala')
    .setVersion('0.1')
    .addTag('D Gala Documentation')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(
    configService.get(EnumEnvName.SWAGGER_PREFIX),
    app,
    document,
  );
}
