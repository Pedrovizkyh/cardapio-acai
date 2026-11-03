import {
  ArgumentsHost,
  Catch,
  ConflictException,
  ExceptionFilter,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '../generated/prisma/client.js';

const traducoes: Record<string, () => HttpException> = {
  P2002: () => new ConflictException('Já existe um registro com esse valor'),
  P2003: () =>
    new ConflictException(
      'Este registro está ligado a outro e não pode ser alterado',
    ),
  P2025: () => new NotFoundException('Registro não encontrado'),
};

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter
  extends BaseExceptionFilter
  implements ExceptionFilter
{
  catch(erro: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const traducao = traducoes[erro.code];
    super.catch(traducao ? traducao() : erro, host);
  }
}
