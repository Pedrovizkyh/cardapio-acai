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
