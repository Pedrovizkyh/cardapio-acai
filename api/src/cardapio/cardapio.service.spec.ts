import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CardapioService } from './cardapio.service.js';

describe('CardapioService', () => {
  const prisma = {
    produto: { findFirst: vi.fn() },
    adicional: { findMany: vi.fn() },
  };
  const service = new CardapioService(prisma as unknown as PrismaService);

  beforeEach(() => vi.clearAllMocks());

  it('devolve o produto com os adicionais ativos', async () => {
    prisma.produto.findFirst.mockResolvedValue({ id: 1, nome: 'Açaí' });
    prisma.adicional.findMany.mockResolvedValue([{ id: 9, nome: 'Granola' }]);

    const produto = await service.detalharProduto(1);

    expect(produto.adicionais).toHaveLength(1);
    expect(prisma.produto.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 1, ativo: true } }),
    );
  });

  it('dá 404 quando o produto não existe ou está esgotado', async () => {
    prisma.produto.findFirst.mockResolvedValue(null);

    await expect(service.detalharProduto(1)).rejects.toThrow(NotFoundException);
  });
});
