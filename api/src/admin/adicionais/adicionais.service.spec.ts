import { ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { AdicionaisService } from './adicionais.service.js';

describe('AdicionaisService', () => {
  const prisma = { adicional: { findUnique: vi.fn(), delete: vi.fn() } };
  const service = new AdicionaisService(prisma as unknown as PrismaService);

  beforeEach(() => vi.clearAllMocks());

  it('não apaga adicional que já foi vendido', async () => {
    prisma.adicional.findUnique.mockResolvedValue({
      id: 1,
      _count: { itens: 1 },
    });
    await expect(service.remover(1)).rejects.toThrow(ConflictException);
    expect(prisma.adicional.delete).not.toHaveBeenCalled();
  });

  it('apaga adicional nunca vendido', async () => {
    prisma.adicional.findUnique.mockResolvedValue({
      id: 1,
      _count: { itens: 0 },
    });
    await service.remover(1);
    expect(prisma.adicional.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });
});
