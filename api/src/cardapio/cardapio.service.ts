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
          orderBy: { id: 'asc' },
          include: { tamanhos: { orderBy: { preco: 'asc' } } },
        },
      },
    });
  }

  async detalharProduto(id: number) {
    const produto = await this.prisma.produto.findFirst({
      where: { id, ativo: true },
      include: {
        tamanhos: { orderBy: { preco: 'asc' } },
        categoria: { select: { aceitaAdicionais: true } },
      },
    });
    if (!produto) {
      throw new NotFoundException('Produto não encontrado');
    }

    const { categoria, ...dados } = produto;
    const adicionais = categoria.aceitaAdicionais
      ? await this.prisma.adicional.findMany({
          where: { ativo: true },
          orderBy: { nome: 'asc' },
        })
      : [];

    return {
      ...dados,
      aceitaAdicionais: categoria.aceitaAdicionais,
      adicionais,
    };
  }
}
