import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import {
  AtualizarTamanhoDto,
  CriarTamanhoDto,
} from '../produtos/dto/produto.dto.js';

@Injectable()
export class TamanhosService {
  constructor(private readonly prisma: PrismaService) {}

  async criar(produtoId: number, dto: CriarTamanhoDto) {
    const existe = await this.prisma.produto.count({
      where: { id: produtoId },
    });
    if (!existe) {
      throw new NotFoundException('Produto não encontrado');
    }
    return this.prisma.tamanho.create({
      data: { nome: dto.nome, preco: dto.preco, produtoId },
    });
  }

  atualizar(id: number, dto: AtualizarTamanhoDto) {
    return this.prisma.tamanho.update({ where: { id }, data: dto });
  }

  async remover(id: number) {
    const tamanho = await this.prisma.tamanho.findUnique({
      where: { id },
      include: {
        _count: { select: { itens: true } },
        produto: { select: { _count: { select: { tamanhos: true } } } },
      },
    });
    if (!tamanho) {
      throw new NotFoundException('Tamanho não encontrado');
    }
    if (tamanho._count.itens > 0) {
      throw new ConflictException(
        'Já existe pedido com este tamanho; mude o preço em vez de apagar',
      );
    }
    if (tamanho.produto._count.tamanhos <= 1) {
      throw new ConflictException(
        'O produto precisa ter pelo menos um tamanho',
      );
    }
    await this.prisma.tamanho.delete({ where: { id } });
  }
}
