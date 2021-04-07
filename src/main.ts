import { NestFactory } from '@nestjs/core';
import * as store from 'connect-redis';
import * as rateLimit from 'express-rate-limit';
import * as session from 'express-session';
import * as helmet from 'helmet';
import * as redis from 'redis';
import { AppModule } from './app.module';
import { setupSwagger } from './common/SwaggerSetup';
import { CustomLoggerService } from './common/CustomLoggerService';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enable('trust proxy');
  app.enableCors({
    origin: [/dolazim\.hr$/, 'http://localhost:8080', 'http://localhost:3001', 'http://localhost:3003'],
  });

  app.useGlobalPipes(new ValidationPipe());

  app.useLogger(app.get(CustomLoggerService));

  app.setGlobalPrefix(process.env.APP_PREFIX || 'api');
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: [`'self'`],
          styleSrc: [`'self'`, `'unsafe-inline'`],
          imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
        },
      },
    }),
  );
  app.enableCors();

  if (process.env.APP_RATE_LIMIT_WINDOW && process.env.APP_RATE_LIMIT_REQUESTS) {
    app.use(
      rateLimit({
        windowMs: +process.env.APP_RATE_LIMIT_WINDOW,
        max: +process.env.APP_RATE_LIMIT_REQUESTS,
      }),
    );
  }

  if (process.env.CACHE_PORT && process.env.SESSION_SECRET) {
    const RedisStore = store(session);
    const redisClient = redis.createClient(+process.env.CACHE_PORT, 'redis_container');
    app.use(
      session({
        store: new RedisStore({ client: redisClient, ttl: process.env.SESSION_TTL }),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
      }),
    );
  }

  setupSwagger(app);

  await app.listen(process.env.APP_PORT || 3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
