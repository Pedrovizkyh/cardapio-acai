import type { Preco } from '../api/tipos.ts'

const formatador = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

// Contas no front são feitas em centavos inteiros; o valor oficial é sempre o da API.
export function emCentavos(preco: Preco): number {
  return Math.round(Number(preco) * 100)
}

export function formatarCentavos(centavos: number): string {
  return formatador.format(centavos / 100)
}

export function formatarPreco(preco: Preco): string {
  return formatarCentavos(emCentavos(preco))
}

export function menorPreco(precos: Preco[]): number | null {
  if (precos.length === 0) return null
  return Math.min(...precos.map(emCentavos))
}

// Converte o que o admin digita ("19,90" ou "19.9") para o número que a API espera.
export function precoDigitado(texto: string): number | null {
  const limpo = texto.trim().replace(',', '.')
  if (!/^\d+(\.\d{1,2})?$/.test(limpo)) return null
  return Number(limpo)
}

export function precoParaCampo(preco: Preco): string {
  return (emCentavos(preco) / 100).toFixed(2).replace('.', ',')
}
