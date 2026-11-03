import axios, { isAxiosError } from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
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
