import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';
import { AuthService } from './auth.service.js';

describe('AuthService', () => {
  const prisma = { usuario: { findUnique: vi.fn() } };
  const jwt = { signAsync: vi.fn().mockResolvedValue('token') };
  const service = new AuthService(
    prisma as unknown as PrismaService,
    jwt as unknown as JwtService,
  );
  const senhaHash = bcrypt.hashSync('admin123', 4);

  beforeEach(() => vi.clearAllMocks());

  it('devolve o token quando e-mail e senha conferem', async () => {
    prisma.usuario.findUnique.mockResolvedValue({
      id: 1,
      email: 'admin@acaidaorla.com',
      senha: senhaHash,
    });

    const resposta = await service.login({
      email: 'admin@acaidaorla.com',
      senha: 'admin123',
    });

    expect(resposta).toEqual({ accessToken: 'token' });
    expect(jwt.signAsync).toHaveBeenCalledWith({
      sub: 1,
      email: 'admin@acaidaorla.com',
    });
  });

  it('recusa senha errada', async () => {
    prisma.usuario.findUnique.mockResolvedValue({
      id: 1,
      email: 'admin@acaidaorla.com',
      senha: senhaHash,
    });

    await expect(
      service.login({ email: 'admin@acaidaorla.com', senha: 'errada' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('recusa e-mail que não existe', async () => {
    prisma.usuario.findUnique.mockResolvedValue(null);

    await expect(
      service.login({ email: 'ninguem@x.com', senha: 'admin123' }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
