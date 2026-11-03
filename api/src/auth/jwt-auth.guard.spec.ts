import { Controller, Get, INestApplication, UseGuards } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { JwtAuthGuard } from './jwt-auth.guard.js';
import { JwtStrategy } from './jwt.strategy.js';

const SEGREDO = 'segredo-de-teste';

@Controller('admin/teste')
@UseGuards(JwtAuthGuard)
class RotaProtegidaController {
  @Get()
  ok() {
    return 'liberado';
  }
}

describe('JwtAuthGuard', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const modulo = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          ignoreEnvFile: true,
          load: [() => ({ JWT_SECRET: SEGREDO })],
        }),
        PassportModule,
      ],
      controllers: [RotaProtegidaController],
      providers: [JwtStrategy],
    }).compile();
    app = modulo.createNestApplication();
    await app.init();
  });

  afterAll(() => app.close());

  it('bloqueia quem não manda token', () =>
    request(app.getHttpServer()).get('/admin/teste').expect(401));

  it('bloqueia token assinado com outro segredo', () => {
    const token = new JwtService({ secret: 'outro' }).sign({ sub: 1 });
    return request(app.getHttpServer())
      .get('/admin/teste')
      .set('Authorization', `Bearer ${token}`)
      .expect(401);
  });

  it('libera token válido', () => {
    const token = new JwtService({ secret: SEGREDO }).sign({ sub: 1 });
    return request(app.getHttpServer())
      .get('/admin/teste')
      .set('Authorization', `Bearer ${token}`)
      .expect(200, 'liberado');
  });
});
