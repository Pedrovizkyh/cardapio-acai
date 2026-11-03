import { ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { PedidosService } from './pedidos.service.js';

describe('PedidosService.mudarStatus', () => {
  const prisma = {
    pedido: {
      findUnique: vi.fn(),
      updateMany: vi.fn(),
      findUniqueOrThrow: vi.fn(),
    },
  };
  const service = new PedidosService(prisma as unknown as PrismaService);

  beforeEach(() => vi.clearAllMocks());

  it('avança o status quando a transição é válida', async () => {
    prisma.pedido.findUnique.mockResolvedValue({
      id: 1,
      status: 'RECEBIDO',
      tipo: 'ENTREGA',
    });
    prisma.pedido.updateMany.mockResolvedValue({ count: 1 });
    prisma.pedido.findUniqueOrThrow.mockResolvedValue({
      id: 1,
      status: 'EM_PREPARO',
      tipo: 'ENTREGA',
    });

    const pedido = await service.mudarStatus(1, 'EM_PREPARO');

    expect(prisma.pedido.updateMany).toHaveBeenCalledWith({
      where: { id: 1, status: 'RECEBIDO' },
      data: { status: 'EM_PREPARO' },
    });
    expect(pedido.proximosStatus).toEqual(['PRONTO', 'CANCELADO']);
  });

  it('recusa transição inválida sem gravar nada', async () => {
    prisma.pedido.findUnique.mockResolvedValue({
      id: 1,
      status: 'SAIU_PARA_ENTREGA',
      tipo: 'ENTREGA',
    });

    await expect(service.mudarStatus(1, 'CANCELADO')).rejects.toThrow(
      'Não dá para ir de SAIU_PARA_ENTREGA para CANCELADO',
    );
    expect(prisma.pedido.updateMany).not.toHaveBeenCalled();
  });

  it('avisa quando outra pessoa mudou o pedido antes', async () => {
    prisma.pedido.findUnique.mockResolvedValue({
      id: 1,
      status: 'RECEBIDO',
      tipo: 'RETIRADA',
    });
    prisma.pedido.updateMany.mockResolvedValue({ count: 0 });

    await expect(service.mudarStatus(1, 'EM_PREPARO')).rejects.toThrow(
      ConflictException,
    );
  });

  it('dá 404 para pedido que não existe', async () => {
    prisma.pedido.findUnique.mockResolvedValue(null);
    await expect(service.mudarStatus(1, 'EM_PREPARO')).rejects.toThrow(
      NotFoundException,
    );
  });
});
