import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('TickEven Core Business Rules (e2e)', () => {
  let app: INestApplication;
  let customerToken: string;
  let organizerToken: string;
  let gateToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('1. Autenticação e Roles', () => {
    it('POST /auth/login - Deve autenticar organizador com credenciais corretas', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'organizador@demo.com', password: '123456' })
        .expect(200);

      expect(res.body).toHaveProperty('accessToken');
      expect(res.body.user.role).toBe('ORGANIZER');
      organizerToken = res.body.accessToken;
    });

    it('POST /auth/login - Deve autenticar cliente com credenciais corretas', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'cliente1@demo.com', password: '123456' })
        .expect(200);

      expect(res.body.user.role).toBe('CUSTOMER');
      customerToken = res.body.accessToken;
    });

    it('POST /auth/login - Deve autenticar agente de portaria', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'portaria@demo.com', password: '123456' })
        .expect(200);

      expect(res.body.user.role).toBe('GATE');
      gateToken = res.body.accessToken;
    });

    it('POST /events - Cliente NÃO deve ter permissão para criar evento (403 Forbidden)', async () => {
      await request(app.getHttpServer())
        .post('/events')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          title: 'Evento Inválido',
          description: 'Teste',
          date: new Date().toISOString(),
          location: 'SP',
          capacity: 100,
          price: 50,
        })
        .expect(403);
    });
  });

  describe('2. Validação da Portaria', () => {
    it('POST /gate/validate - Ingresso Ativo válido deve ser liberado', async () => {
      const res = await request(app.getHttpServer())
        .post('/gate/validate')
        .set('Authorization', `Bearer ${gateToken}`)
        .send({ token: 'demo-ticket-active-hash-12345' })
        .expect(200);

      expect(res.body.result).toBe('VALID');
    });

    it('POST /gate/validate - Ingresso já utilizado deve retornar ALREADY_USED', async () => {
      const res = await request(app.getHttpServer())
        .post('/gate/validate')
        .set('Authorization', `Bearer ${gateToken}`)
        .send({ token: 'demo-ticket-used-hash-67890' })
        .expect(200);

      expect(res.body.result).toBe('ALREADY_USED');
    });

    it('POST /gate/validate - Token inexistente deve retornar INVALID', async () => {
      const res = await request(app.getHttpServer())
        .post('/gate/validate')
        .set('Authorization', `Bearer ${gateToken}`)
        .send({ token: 'token-inexistente-123' })
        .expect(200);

      expect(res.body.result).toBe('INVALID');
    });
  });
});
