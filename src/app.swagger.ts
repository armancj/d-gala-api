import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { EnumEnvName } from './common/config';
import { Request, Response } from 'express';

export function AppSwagger(
  app: INestApplication,
  configService: ConfigService,
) {
  const config = new DocumentBuilder()
    .setTitle('D Gala - API Documentation')
    .setDescription(
      'The documentation D Gala. [Click here to download the Swagger JSON file](/swagger-json)',
    )
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

  app.getHttpAdapter().get('/swagger-json', (req: Request, res: Response) => {
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=apiDGalaSwagger.json',
    );
    res.setHeader('Content-Type', 'application/json');
    res.send(document);
  });
}
