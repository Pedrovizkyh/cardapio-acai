import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import {
  AtualizarAdicionalDto,
  CriarAdicionalDto,
} from './dto/adicional.dto.js';

@Injectable()
export class AdicionaisService {
  constructor(private readonly prisma: PrismaService) {}

  listar() {
    return this.prisma.adicional.findMany({ orderBy: { nome: 'asc' } });
  }

  criar(dto: CriarAdicionalDto) {
    return this.prisma.adicional.create({ data: dto });
  }

  atualizar(id: number, dto: AtualizarAdicionalDto) {
    return this.prisma.adicional.update({ where: { id }, data: dto });
  }

  async remover(id: number) {
    const adicional = await this.prisma.adicional.findUnique({
      where: { id },
      include: { _count: { select: { itens: true } } },
    });
    if (!adicional) {
      throw new NotFoundException('Adicional não encontrado');
    }
    if (adicional._count.itens > 0) {
      throw new ConflictException(
        'Já existe pedido com este adicional; desative em vez de apagar',
      );
    }
    await this.prisma.adicional.delete({ where: { id } });
  }
}
