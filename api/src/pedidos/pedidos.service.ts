import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { StatusPedido, TipoEntrega } from '../generated/prisma/enums.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CriarPedidoDto } from './dto/criar-pedido.dto.js';
import { detalhesDoPedido } from './pedido.include.js';
import { calcularTotal } from './regras/calculo.js';
import { montarItens } from './regras/montagem.js';
import { podeMudarStatus, proximosStatus } from './regras/status.js';

const LIMITE_PAINEL = 100;

@Injectable()
export class PedidosService {
  constructor(private readonly prisma: PrismaService) {}

  criar(dto: CriarPedidoDto) {
    return this.prisma.$transaction(async (tx) => {
      const produtoIds = [...new Set(dto.itens.map((i) => i.produtoId))];
      const adicionalIds = [...new Set(dto.itens.flatMap((i) => i.adicionais))];

      const [produtos, adicionais] = await Promise.all([
        tx.produto.findMany({
          where: { id: { in: produtoIds } },
          include: {
            tamanhos: true,
            categoria: { select: { aceitaAdicionais: true } },
          },
        }),
        tx.adicional.findMany({ where: { id: { in: adicionalIds } } }),
      ]);

      const itens = montarItens(dto.itens, produtos, adicionais);
      const total = calcularTotal(
        itens.map(({ item, tamanho, adicionais }) => ({
          precoTamanho: tamanho.preco,
          precosAdicionais: adicionais.map((a) => a.preco),
          quantidade: item.quantidade,
        })),
      );

      return tx.pedido.create({
        data: {
          cliente: dto.cliente,
          telefone: dto.telefone,
          endereco: dto.tipo === TipoEntrega.ENTREGA ? dto.endereco : null,
          tipo: dto.tipo,
          pagamento: dto.pagamento,
          total,
          itens: {
            create: itens.map(({ item, tamanho, adicionais }) => ({
              produtoId: item.produtoId,
              tamanhoId: tamanho.id,
              quantidade: item.quantidade,
              observacao: item.observacao,
              precoUnitario: tamanho.preco,
              adicionais: {
                create: adicionais.map((a) => ({
                  adicionalId: a.id,
                  preco: a.preco,
                })),
              },
            })),
          },
        },
        include: detalhesDoPedido,
      });
    });
  }

  async listar(status?: StatusPedido) {
    const pedidos = await this.prisma.pedido.findMany({
      where: { status },
      orderBy: { criadoEm: 'desc' },
      take: LIMITE_PAINEL,
      include: detalhesDoPedido,
    });
    return pedidos.map((pedido) => ({
      ...pedido,
      proximosStatus: proximosStatus(pedido.status, pedido.tipo),
    }));
  }

  async mudarStatus(id: number, novo: StatusPedido) {
    const pedido = await this.prisma.pedido.findUnique({ where: { id } });
    if (!pedido) {
      throw new NotFoundException('Pedido não encontrado');
    }
    if (!podeMudarStatus(pedido.status, novo, pedido.tipo)) {
      throw new ConflictException(
        `Não dá para ir de ${pedido.status} para ${novo}`,
      );
    }

    // Só grava se ninguém mudou o status entre a leitura e a escrita.
    const { count } = await this.prisma.pedido.updateMany({
      where: { id, status: pedido.status },
      data: { status: novo },
    });
    if (count === 0) {
      throw new ConflictException('O pedido mudou; atualize a tela');
    }

    const atualizado = await this.prisma.pedido.findUniqueOrThrow({
      where: { id },
      include: detalhesDoPedido,
    });
    return {
      ...atualizado,
      proximosStatus: proximosStatus(atualizado.status, atualizado.tipo),
    };
  }
}
