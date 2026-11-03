import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class CardapioService {
  constructor(private readonly prisma: PrismaService) {}

  listar() {
    return this.prisma.categoria.findMany({
      orderBy: { ordem: 'asc' },
      include: {
        produtos: {
          where: { ativo: true },
          orderBy: { nome: 'asc' },
          include: { tamanhos: { orderBy: { preco: 'asc' } } },
        },
      },
    });
  }

  async detalharProduto(id: number) {
    const produto = await this.prisma.produto.findFirst({
      where: { id, ativo: true },
      include: { tamanhos: { orderBy: { preco: 'asc' } } },
    });
    if (!produto) {
      throw new NotFoundException('Produto não encontrado');
    }

    const adicionais = await this.prisma.adicional.findMany({
      where: { ativo: true },
      orderBy: { nome: 'asc' },
    });

    return { ...produto, adicionais };
  }
}
