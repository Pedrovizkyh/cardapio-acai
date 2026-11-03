import { ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { TamanhosService } from './tamanhos.service.js';

describe('TamanhosService', () => {
  const prisma = { tamanho: { findUnique: vi.fn(), delete: vi.fn() } };
  const service = new TamanhosService(prisma as unknown as PrismaService);

  const tamanho = (itens: number, tamanhosDoProduto: number) => ({
    id: 1,
    _count: { itens },
    produto: { _count: { tamanhos: tamanhosDoProduto } },
  });

  beforeEach(() => vi.clearAllMocks());

  it('não apaga tamanho que já foi vendido', async () => {
    prisma.tamanho.findUnique.mockResolvedValue(tamanho(2, 3));
    await expect(service.remover(1)).rejects.toThrow(ConflictException);
  });

  it('não apaga o último tamanho do produto', async () => {
    prisma.tamanho.findUnique.mockResolvedValue(tamanho(0, 1));
    await expect(service.remover(1)).rejects.toThrow(ConflictException);
  });

  it('apaga tamanho nunca vendido quando sobram outros', async () => {
    prisma.tamanho.findUnique.mockResolvedValue(tamanho(0, 2));
    await service.remover(1);
    expect(prisma.tamanho.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });
});
