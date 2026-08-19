import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

// Cache da instância para reutilização em ambiente serverless (Vercel)
let cachedServer: any;

async function bootstrapServer() {
  const app = await NestFactory.create(AppModule);

  if (process.env.VERCEL) {
    app.setGlobalPrefix('api');
  }

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.init();
  return app.getHttpAdapter().getInstance();
}

// Modo local: inicia o servidor normalmente com app.listen()
if (!process.env.VERCEL) {
  async function bootstrapLocal() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });

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
  bootstrapLocal();
}

// Handler serverless exportado para a Vercel
export default async function (req: any, res: any) {
  try {
    if (!cachedServer) {
      cachedServer = await bootstrapServer();
    }
    return cachedServer(req, res);
  } catch (error: any) {
    console.error('🔥 ERRO CRÍTICO NA INICIALIZAÇÃO DO NESTJS:', error);
    return res.status(500).json({ 
      statusCode: 500, 
      message: 'Erro interno ao iniciar a aplicação (Vercel Serverless)',
      details: error?.message || String(error)
    });
  }
}
