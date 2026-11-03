import { useQuery } from '@tanstack/react-query'
import { api } from './cliente.ts'
import type { Categoria, ProdutoDetalhe } from './tipos.ts'

export function useCardapio() {
  return useQuery({
    queryKey: ['cardapio'],
    queryFn: async () => (await api.get<Categoria[]>('/cardapio')).data,
  })
}

export function useProduto(id: number) {
  return useQuery({
    queryKey: ['produto', id],
    queryFn: async () => (await api.get<ProdutoDetalhe>(`/produtos/${id}`)).data,
    enabled: Number.isInteger(id),
  })
}
