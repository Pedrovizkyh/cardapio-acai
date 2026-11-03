import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './cliente.ts'
import type { PedidoAdmin, StatusPedido } from './tipos.ts'

export function useLogin() {
  return useMutation({
    mutationFn: async (dados: { email: string; senha: string }) =>
      (await api.post<{ accessToken: string }>('/auth/login', dados)).data,
  })
}

export function usePedidosAdmin(status: StatusPedido | null) {
  return useQuery({
    queryKey: ['admin', 'pedidos', status],
    queryFn: async () =>
      (
        await api.get<PedidoAdmin[]>('/admin/pedidos', {
          params: status ? { status } : undefined,
        })
      ).data,
    refetchInterval: 15_000,
  })
}

export function useMudarStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: StatusPedido }) =>
      (await api.patch<PedidoAdmin>(`/admin/pedidos/${id}/status`, { status })).data,
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['admin', 'pedidos'] }),
  })
}
