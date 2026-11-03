import { Injectable } from '@nestjs/common';
import { TipoEntrega } from '../generated/prisma/enums.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CriarPedidoDto } from './dto/criar-pedido.dto.js';
import { detalhesDoPedido } from './pedido.include.js';
import { calcularTotal } from './regras/calculo.js';
import { montarItens } from './regras/montagem.js';

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
          include: { tamanhos: true },
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
}
