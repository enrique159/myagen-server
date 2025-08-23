import { webcrypto } from 'node:crypto';

if (typeof global.crypto === 'undefined') {
  (global as any).crypto = webcrypto;
}

import { TransformInterceptor } from './shared/interceptors/transform.interceptor';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { useContainer } from 'class-validator';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.use(cookieParser());
  app.enableCors({
    origin: configService.get('origins'),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/files',
  });
  await app.listen(configService.get('port') || 3333);
}
bootstrap();