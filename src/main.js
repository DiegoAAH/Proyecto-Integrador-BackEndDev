import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  // La validación de cada body/query se declara en el controlador con validar(Dto)
  // (ver src/common/pipes/validar.js), porque en JavaScript Nest no conoce el tipo del parámetro.

  const config = new DocumentBuilder()
    .setTitle('TrackOrder API')
    .setDescription('API REST de gestión y seguimiento de pedidos en tiempo real')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, config));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
