import { Prisma } from '../../generated/prisma/client.js';

export type ItemParaCalculo = {
  precoTamanho: Prisma.Decimal;
  precosAdicionais: Prisma.Decimal[];
  quantidade: number;
};

export function calcularSubtotal(item: ItemParaCalculo): Prisma.Decimal {
  const precoDeUm = item.precosAdicionais.reduce(
    (soma, preco) => soma.add(preco),
    item.precoTamanho,
  );
  return precoDeUm.mul(item.quantidade);
}

export function calcularTotal(itens: ItemParaCalculo[]): Prisma.Decimal {
  return itens.reduce(
    (total, item) => total.add(calcularSubtotal(item)),
    new Prisma.Decimal(0),
  );
}
