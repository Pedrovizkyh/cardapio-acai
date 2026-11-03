import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import {
  AtualizarCategoriaDto,
  CriarCategoriaDto,
} from './dto/categoria.dto.js';

@Injectable()
export class CategoriasService {
  constructor(private readonly prisma: PrismaService) {}

  listar() {
    return this.prisma.categoria.findMany({
      orderBy: { ordem: 'asc' },
      include: { _count: { select: { produtos: true } } },
    });
  }

  criar(dto: CriarCategoriaDto) {
    return this.prisma.categoria.create({ data: dto });
  }

  atualizar(id: number, dto: AtualizarCategoriaDto) {
    return this.prisma.categoria.update({ where: { id }, data: dto });
  }

  async remover(id: number) {
    const categoria = await this.prisma.categoria.findUnique({
      where: { id },
      include: { _count: { select: { produtos: true } } },
    });
    if (!categoria) {
      throw new NotFoundException('Categoria não encontrada');
    }
    if (categoria._count.produtos > 0) {
      throw new ConflictException(
        'A categoria tem produtos; mova ou apague os produtos antes',
      );
    }
    await this.prisma.categoria.delete({ where: { id } });
  }
}
