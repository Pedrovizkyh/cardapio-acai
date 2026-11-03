import axios, { isAxiosError } from 'axios'
import { useSessao } from '../admin/sessao.ts'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
})

api.interceptors.request.use((config) => {
  const { token } = useSessao.getState()
  if (token && config.url?.startsWith('/admin')) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Token vencido ou inválido: desloga, e a rota protegida leva de volta ao login.
api.interceptors.response.use(undefined, (erro: unknown) => {
  if (isAxiosError(erro) && erro.response?.status === 401 && erro.config?.url?.startsWith('/admin')) {
    useSessao.getState().sair()
  }
  return Promise.reject(erro)
})

export function mensagemDeErro(erro: unknown): string {
  if (isAxiosError<{ message?: string | string[] }>(erro)) {
    const mensagem = erro.response?.data?.message
    if (Array.isArray(mensagem)) return mensagem.join('. ')
    if (mensagem) return mensagem
    if (!erro.response) return 'Sem conexão com o servidor.'
  }
  return 'Algo deu errado. Tente de novo.'
}
