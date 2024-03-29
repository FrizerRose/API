import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const setupSwagger = (app: INestApplication): void => {
  // TODO: disable swagger in production
  // if (process.env.NODE_ENV == 'development') {
  const options = new DocumentBuilder().setTitle('API documentation').build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(process.env.APP_PREFIX || 'api', app, document);
  // }
};
