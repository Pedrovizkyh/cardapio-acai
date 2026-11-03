import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';
import { LoginDto } from './dto/login.dto.js';

export type JwtPayload = { sub: number; email: string };

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async login({ email, senha }: LoginDto) {
    const usuario = await this.prisma.usuario.findUnique({ where: { email } });
    const senhaConfere =
      usuario !== null && (await bcrypt.compare(senha, usuario.senha));

    // Mesma mensagem para e-mail e senha errados, para não revelar quais e-mails existem.
    if (!usuario || !senhaConfere) {
      throw new UnauthorizedException('E-mail ou senha inválidos');
    }

    const payload: JwtPayload = { sub: usuario.id, email: usuario.email };
    return { accessToken: await this.jwt.signAsync(payload) };
  }
}
