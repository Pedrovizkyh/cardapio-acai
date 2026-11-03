import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Preco } from '../api/tipos.ts'
import { emCentavos } from '../lib/preco.ts'

export type AdicionalEscolhido = { id: number; nome: string; preco: Preco }

export type ItemCarrinho = {
  chave: string
  produtoId: number
  produtoNome: string
  imagem?: string | null
  tamanhoId: number
  tamanhoNome: string
  precoTamanho: Preco
  adicionais: AdicionalEscolhido[]
  quantidade: number
  observacao: string
}

export type NovoItem = Omit<ItemCarrinho, 'chave'>

export const QUANTIDADE_MAXIMA = 20

type EstadoCarrinho = {
  itens: ItemCarrinho[]
  adicionar: (item: NovoItem) => void
  alterarQuantidade: (chave: string, quantidade: number) => void
  substituir: (chave: string, item: NovoItem) => void
  remover: (chave: string) => void
  limpar: () => void
}

// Itens com as mesmas escolhas viram uma linha só, somando a quantidade.
function chaveDoItem(item: NovoItem): string {
  const adicionais = item.adicionais.map((a) => a.id).sort((a, b) => a - b)
  return [item.produtoId, item.tamanhoId, adicionais.join('.'), item.observacao.trim()].join('|')
}

function novaLinha(item: NovoItem): ItemCarrinho {
  return {
    ...item,
    observacao: item.observacao.trim(),
    quantidade: limitar(item.quantidade),
    chave: chaveDoItem(item),
  }
}

const limitar = (quantidade: number) =>
  Math.min(QUANTIDADE_MAXIMA, Math.max(1, quantidade))

export const useCarrinho = create<EstadoCarrinho>()(
  persist(
    (set) => ({
      itens: [],
      adicionar: (novo) =>
        set((estado) => {
          const chave = chaveDoItem(novo)
          const existente = estado.itens.find((i) => i.chave === chave)
          if (existente) {
            return {
              itens: estado.itens.map((i) =>
                i.chave === chave
                  ? { ...i, quantidade: limitar(i.quantidade + novo.quantidade) }
                  : i,
              ),
            }
          }
          return { itens: [...estado.itens, novaLinha(novo)] }
        }),
      // Edição de um item: troca a linha no mesmo lugar. Se as novas escolhas
      // coincidirem com outra linha, as duas viram uma só.
      substituir: (chave, novo) =>
        set((estado) => {
          const linha = novaLinha(novo)
          const outra = estado.itens.find((i) => i.chave === linha.chave && i.chave !== chave)
          if (outra) {
            return {
              itens: estado.itens
                .filter((i) => i.chave !== chave)
                .map((i) =>
                  i.chave === linha.chave
                    ? { ...i, quantidade: limitar(i.quantidade + linha.quantidade) }
                    : i,
                ),
            }
          }
          return { itens: estado.itens.map((i) => (i.chave === chave ? linha : i)) }
        }),
      alterarQuantidade: (chave, quantidade) =>
        set((estado) => ({
          itens: estado.itens.map((i) =>
            i.chave === chave ? { ...i, quantidade: limitar(quantidade) } : i,
          ),
        })),
      remover: (chave) =>
        set((estado) => ({ itens: estado.itens.filter((i) => i.chave !== chave) })),
      limpar: () => set({ itens: [] }),
    }),
    {
      name: 'acai-da-orla:carrinho',
      version: 1,
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

export function precoUnitarioEmCentavos(item: Pick<ItemCarrinho, 'precoTamanho' | 'adicionais'>) {
  return item.adicionais.reduce((soma, a) => soma + emCentavos(a.preco), emCentavos(item.precoTamanho))
}

export function subtotalEmCentavos(item: ItemCarrinho) {
  return precoUnitarioEmCentavos(item) * item.quantidade
}

export function totalEmCentavos(itens: ItemCarrinho[]) {
  return itens.reduce((total, item) => total + subtotalEmCentavos(item), 0)
}

export function contarItens(itens: ItemCarrinho[]) {
  return itens.reduce((total, item) => total + item.quantidade, 0)
}
