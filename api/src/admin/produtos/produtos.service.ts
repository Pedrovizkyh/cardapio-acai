import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { AtualizarProdutoDto, CriarProdutoDto } from './dto/produto.dto.js';

const comTamanhos = {
  categoria: { select: { id: true, nome: true } },
  tamanhos: { orderBy: { preco: 'asc' } },
} as const;

@Injectable()
export class ProdutosService {
  constructor(private readonly prisma: PrismaService) {}

  listar() {
    return this.prisma.produto.findMany({
      orderBy: [{ categoria: { ordem: 'asc' } }, { nome: 'asc' }],
      include: comTamanhos,
    });
  }

  async buscar(id: number) {
    const produto = await this.prisma.produto.findUnique({
      where: { id },
      include: comTamanhos,
    });
    if (!produto) {
      throw new NotFoundException('Produto não encontrado');
    }
    return produto;
  }

  async criar({ tamanhos, ...dados }: CriarProdutoDto) {
    await this.garantirCategoria(dados.categoriaId);
    return this.prisma.produto.create({
      data: { ...dados, tamanhos: { create: tamanhos } },
      include: comTamanhos,
    });
  }

  async atualizar(id: number, dto: AtualizarProdutoDto) {
    if (dto.categoriaId !== undefined) {
      await this.garantirCategoria(dto.categoriaId);
    }
    return this.prisma.produto.update({
      where: { id },
      data: dto,
      include: comTamanhos,
    });
  }

  async remover(id: number) {
    const produto = await this.prisma.produto.findUnique({
      where: { id },
      include: { _count: { select: { itens: true } } },
    });
    if (!produto) {
      throw new NotFoundException('Produto não encontrado');
    }
    if (produto._count.itens > 0) {
      throw new ConflictException(
        'Já existe pedido com este produto; desative em vez de apagar',
      );
    }
    await this.prisma.produto.delete({ where: { id } });
  }

  private async garantirCategoria(id: number) {
    const existe = await this.prisma.categoria.count({ where: { id } });
    if (!existe) {
      throw new NotFoundException('Categoria não encontrada');
    }
  }
}
