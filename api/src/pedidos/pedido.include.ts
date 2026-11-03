import type { Prisma } from '../generated/prisma/client.js';

export const detalhesDoPedido = {
  itens: {
    include: {
      produto: { select: { id: true, nome: true } },
      tamanho: { select: { id: true, nome: true } },
      adicionais: {
        include: { adicional: { select: { id: true, nome: true } } },
      },
    },
  },
} satisfies Prisma.PedidoInclude;
