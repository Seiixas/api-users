import { DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';

import { Env } from '@/shared/env';

type SwaggerConfig = Omit<OpenAPIObject, 'paths'>;

export const swaggerConfig: SwaggerConfig = new DocumentBuilder()
  .setTitle('GoingTest')
  .setVersion('1.0')
  .setDescription('Documentação da API do projeto GoingTest.')
  .addTag('users')
  .addBearerAuth()
  .addServer(Env.SERVER_URL)
  .build();
