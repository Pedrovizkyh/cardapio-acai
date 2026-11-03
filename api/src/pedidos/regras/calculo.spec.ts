import { Prisma } from '../../generated/prisma/client.js';
import { calcularSubtotal, calcularTotal } from './calculo.js';

const d = (valor: string) => new Prisma.Decimal(valor);

describe('calcularSubtotal', () => {
  it('é o preço do tamanho vezes a quantidade quando não há adicionais', () => {
    const subtotal = calcularSubtotal({
      precoTamanho: d('19.90'),
      precosAdicionais: [],
      quantidade: 3,
    });
    expect(subtotal.toFixed(2)).toBe('59.70');
  });

  it('soma os adicionais ao preço de cada unidade antes de multiplicar', () => {
    const subtotal = calcularSubtotal({
      precoTamanho: d('19.90'),
      precosAdicionais: [d('2.00'), d('3.50')],
      quantidade: 2,
    });
    expect(subtotal.toFixed(2)).toBe('50.80');
  });
});

describe('calcularTotal', () => {
  it('soma os subtotais de todos os itens', () => {
    const total = calcularTotal([
      {
        precoTamanho: d('19.90'),
        precosAdicionais: [d('2.00')],
        quantidade: 2,
      },
      { precoTamanho: d('8.90'), precosAdicionais: [], quantidade: 1 },
    ]);
    expect(total.toFixed(2)).toBe('52.70');
  });

  it('não perde centavos como o Float perderia', () => {
    const total = calcularTotal([
      { precoTamanho: d('0.10'), precosAdicionais: [d('0.20')], quantidade: 1 },
    ]);
    expect(0.1 + 0.2).not.toBe(0.3);
    expect(total.equals(d('0.30'))).toBe(true);
  });

  it('acumula muitos centavos sem erro de arredondamento', () => {
    const itens = Array.from({ length: 30 }, () => ({
      precoTamanho: d('14.90'),
      precosAdicionais: [d('2.50'), d('3.00')],
      quantidade: 20,
    }));
    expect(calcularTotal(itens).toFixed(2)).toBe('12240.00');
  });

  it('é zero quando não há itens', () => {
    expect(calcularTotal([]).toFixed(2)).toBe('0.00');
  });
});
