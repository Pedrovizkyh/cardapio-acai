import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './cliente.ts'
import type { Adicional, CategoriaAdmin, ProdutoAdmin, Tamanho } from './tipos.ts'

export type DadosProduto = {
  nome: string
  descricao: string
  categoriaId: number
  imagem?: string
  ativo?: boolean
}
export type DadosTamanho = { nome: string; preco: number }
export type DadosAdicional = { nome: string; preco: number; ativo?: boolean }
export type DadosCategoria = { nome: string; ordem?: number; aceitaAdicionais?: boolean }

export function useCategoriasAdmin() {
  return useQuery({
    queryKey: ['admin', 'categorias'],
    queryFn: async () => (await api.get<CategoriaAdmin[]>('/admin/categorias')).data,
  })
}

export function useProdutosAdmin() {
  return useQuery({
    queryKey: ['admin', 'produtos'],
    queryFn: async () => (await api.get<ProdutoAdmin[]>('/admin/produtos')).data,
  })
}

export function useProdutoAdmin(id: number | null) {
  return useQuery({
    queryKey: ['admin', 'produtos', id],
    queryFn: async () => (await api.get<ProdutoAdmin>(`/admin/produtos/${id}`)).data,
    enabled: id !== null,
  })
}

export function useAdicionaisAdmin() {
  return useQuery({
    queryKey: ['admin', 'adicionais'],
    queryFn: async () => (await api.get<Adicional[]>('/admin/adicionais')).data,
  })
}

// Qualquer mudança no cardápio invalida o painel e também o cardápio público,
// para o "esgotado" aparecer na hora nas duas telas.
function useMutacaoDoCardapio<Entrada, Saida>(fn: (entrada: Entrada) => Promise<Saida>) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: fn,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin'] }),
        queryClient.invalidateQueries({ queryKey: ['cardapio'] }),
        queryClient.invalidateQueries({ queryKey: ['produto'] }),
      ])
    },
  })
}

export const useCriarProduto = () =>
  useMutacaoDoCardapio(async (dados: DadosProduto & { tamanhos: DadosTamanho[] }) =>
    (await api.post<ProdutoAdmin>('/admin/produtos', dados)).data,
  )

export const useAtualizarProduto = () =>
  useMutacaoDoCardapio(async ({ id, ...dados }: Partial<DadosProduto> & { id: number }) =>
    (await api.patch<ProdutoAdmin>(`/admin/produtos/${id}`, dados)).data,
  )

export const useRemoverProduto = () =>
  useMutacaoDoCardapio(async (id: number) => {
    await api.delete(`/admin/produtos/${id}`)
  })

export const useCriarTamanho = () =>
  useMutacaoDoCardapio(async ({ produtoId, ...dados }: DadosTamanho & { produtoId: number }) =>
    (await api.post<Tamanho>(`/admin/produtos/${produtoId}/tamanhos`, dados)).data,
  )

export const useAtualizarTamanho = () =>
  useMutacaoDoCardapio(async ({ id, ...dados }: DadosTamanho & { id: number }) =>
    (await api.patch<Tamanho>(`/admin/tamanhos/${id}`, dados)).data,
  )

export const useRemoverTamanho = () =>
  useMutacaoDoCardapio(async (id: number) => {
    await api.delete(`/admin/tamanhos/${id}`)
  })
