import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS para permitir requisições do frontend React (Vercel + Localhost)
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Habilitar validação global de DTOs com class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Backend TickEven rodando em http://localhost:${port}`);
}
bootstrap();
