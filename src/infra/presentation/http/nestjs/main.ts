import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';

import { Env } from '@/shared/env';

import { AppModule } from './app.module';
import { swaggerConfig } from './config/docs/swagger.docs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(Env.PORT ?? 3000);
}
bootstrap();
