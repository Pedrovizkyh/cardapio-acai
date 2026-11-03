import { BadRequestException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { montarItens, ProdutoComTamanhos } from './montagem.js';

const d = (v: string) => new Prisma.Decimal(v);

const acai: ProdutoComTamanhos = {
  id: 1,
  nome: 'Açaí Tradicional',
  descricao: '',
  imagem: null,
  ativo: true,
  categoriaId: 1,
  tamanhos: [{ id: 10, nome: '500 ml', preco: d('19.90'), produtoId: 1 }],
};
const esgotado: ProdutoComTamanhos = {
  ...acai,
  id: 2,
  ativo: false,
  tamanhos: [{ id: 20, nome: '300 ml', preco: d('9.90'), produtoId: 2 }],
};
const granola = { id: 100, nome: 'Granola', preco: d('2.00'), ativo: true };
const morangoInativo = {
  id: 101,
  nome: 'Morango',
  preco: d('3.50'),
  ativo: false,
};

const produtos = [acai, esgotado];
const adicionais = [granola, morangoInativo];

const item = (parcial: object) => ({
  produtoId: 1,
  tamanhoId: 10,
  adicionais: [],
  quantidade: 1,
  ...parcial,
});

describe('montarItens', () => {
  it('usa o tamanho e os adicionais do banco', () => {
    const [montado] = montarItens(
      [item({ adicionais: [100] })],
      produtos,
      adicionais,
    );
    expect(montado.tamanho.preco.toFixed(2)).toBe('19.90');
    expect(montado.adicionais.map((a) => a.nome)).toEqual(['Granola']);
  });

  it('recusa produto que não existe', () => {
    expect(() =>
      montarItens([item({ produtoId: 999 })], produtos, adicionais),
    ).toThrow(BadRequestException);
  });

  it('recusa produto esgotado', () => {
    expect(() =>
      montarItens(
        [item({ produtoId: 2, tamanhoId: 20 })],
        produtos,
        adicionais,
      ),
    ).toThrow('O produto 2 não está disponível');
  });

  it('recusa tamanho de outro produto', () => {
    expect(() =>
      montarItens([item({ tamanhoId: 20 })], produtos, adicionais),
    ).toThrow('O tamanho 20 não pertence ao produto Açaí Tradicional');
  });

  it('recusa adicional inativo', () => {
    expect(() =>
      montarItens([item({ adicionais: [101] })], produtos, adicionais),
    ).toThrow('O adicional 101 não está disponível');
  });

  it('recusa adicional que não existe', () => {
    expect(() =>
      montarItens([item({ adicionais: [555] })], produtos, adicionais),
    ).toThrow(BadRequestException);
  });
});
