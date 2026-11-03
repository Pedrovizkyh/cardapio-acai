import { ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { ProdutosService } from './produtos.service.js';

describe('ProdutosService', () => {
  const prisma = {
    produto: { findUnique: vi.fn(), delete: vi.fn(), create: vi.fn() },
    categoria: { count: vi.fn() },
  };
  const service = new ProdutosService(prisma as unknown as PrismaService);

  beforeEach(() => vi.clearAllMocks());

  it('não apaga produto que já apareceu em pedido', async () => {
    prisma.produto.findUnique.mockResolvedValue({
      id: 1,
      _count: { itens: 3 },
    });

    await expect(service.remover(1)).rejects.toThrow(ConflictException);
    expect(prisma.produto.delete).not.toHaveBeenCalled();
  });

  it('apaga produto que nunca foi vendido', async () => {
    prisma.produto.findUnique.mockResolvedValue({
      id: 1,
      _count: { itens: 0 },
    });

    await service.remover(1);

    expect(prisma.produto.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('não cria produto em categoria que não existe', async () => {
    prisma.categoria.count.mockResolvedValue(0);

    await expect(
      service.criar({
        nome: 'X',
        descricao: '',
        categoriaId: 99,
        tamanhos: [{ nome: '300 ml', preco: 10 }],
      }),
    ).rejects.toThrow(NotFoundException);
    expect(prisma.produto.create).not.toHaveBeenCalled();
  });
});
