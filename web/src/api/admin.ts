import { useMutation } from '@tanstack/react-query'
import { api } from './cliente.ts'

export function useLogin() {
  return useMutation({
    mutationFn: async (dados: { email: string; senha: string }) =>
      (await api.post<{ accessToken: string }>('/auth/login', dados)).data,
  })
}
