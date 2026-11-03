import { ArgumentsHost } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaExceptionFilter } from './prisma-exception.filter.js';

function respostaFalsa() {
  const resposta = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  };
  const host = {
    getType: () => 'http',
    getArgByIndex: (i: number) => (i === 1 ? resposta : {}),
    switchToHttp: () => ({ getResponse: () => resposta }),
  } as unknown as ArgumentsHost;
  return { resposta, host };
}

function erroPrisma(code: string) {
  return new Prisma.PrismaClientKnownRequestError('erro', {
    code,
    clientVersion: 'teste',
  });
}

describe('PrismaExceptionFilter', () => {
  const adapter = {
    isHeadersSent: () => false,
    reply: (
      res: { status: (s: number) => { json: (b: unknown) => void } },
      body: unknown,
      status: number,
    ) => res.status(status).json(body),
  };
  const filtro = new PrismaExceptionFilter(adapter as never);

  it.each([
    ['P2025', 404],
    ['P2002', 409],
    ['P2003', 409],
  ])('traduz %s para %i', (code, status) => {
    const { resposta, host } = respostaFalsa();
    filtro.catch(erroPrisma(code), host);
    expect(resposta.status).toHaveBeenCalledWith(status);
  });
});
