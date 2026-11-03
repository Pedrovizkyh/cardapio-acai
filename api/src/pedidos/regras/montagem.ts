import { BadRequestException } from '@nestjs/common';
import type {
  Adicional,
  Categoria,
  Produto,
  Tamanho,
} from '../../generated/prisma/client.js';
import type { ItemPedidoDto } from '../dto/criar-pedido.dto.js';

export type ProdutoComTamanhos = Produto & {
  tamanhos: Tamanho[];
  categoria: Pick<Categoria, 'aceitaAdicionais'>;
};

export type ItemMontado = {
  item: ItemPedidoDto;
  tamanho: Tamanho;
  adicionais: Adicional[];
};

export function montarItens(
  itens: ItemPedidoDto[],
  produtos: ProdutoComTamanhos[],
  adicionais: Adicional[],
): ItemMontado[] {
  const produtoPorId = new Map(produtos.map((p) => [p.id, p]));
  const adicionalPorId = new Map(adicionais.map((a) => [a.id, a]));

  return itens.map((item) => {
    const produto = produtoPorId.get(item.produtoId);
    if (!produto || !produto.ativo) {
      throw new BadRequestException(
        `O produto ${item.produtoId} não está disponível`,
      );
    }

    const tamanho = produto.tamanhos.find((t) => t.id === item.tamanhoId);
    if (!tamanho) {
      throw new BadRequestException(
        `O tamanho ${item.tamanhoId} não pertence ao produto ${produto.nome}`,
      );
    }

    if (item.adicionais.length > 0 && !produto.categoria.aceitaAdicionais) {
      throw new BadRequestException(
        `O produto ${produto.nome} não aceita adicionais`,
      );
    }

    const escolhidos = item.adicionais.map((id) => {
      const adicional = adicionalPorId.get(id);
      if (!adicional || !adicional.ativo) {
        throw new BadRequestException(`O adicional ${id} não está disponível`);
      }
      return adicional;
    });

    return { item, tamanho, adicionais: escolhidos };
  });
}
