import { DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';

type SwaggerConfig = Omit<OpenAPIObject, 'paths'>;

export const swaggerConfig: SwaggerConfig = new DocumentBuilder()
  .setTitle('GoingTest')
  .setVersion('1.0')
  .setDescription('Documentação da API do projeto GoingTest.')
  .addTag('users')
  .setBasePath('http://localhost:3000')
  .build();
