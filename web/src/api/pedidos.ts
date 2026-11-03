import { useMutation } from '@tanstack/react-query'
import { api } from './cliente.ts'
import type { NovoPedido, Pedido } from './tipos.ts'

export function useCriarPedido() {
  return useMutation({
    mutationFn: async (pedido: NovoPedido) =>
      (await api.post<Pedido>('/pedidos', pedido)).data,
  })
}
