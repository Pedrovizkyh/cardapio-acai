import type { FormaPagamento, ItemDoPedido, Pedido, TipoEntrega } from '../api/tipos.ts'
import { emCentavos } from './preco.ts'

export const nomeDoPagamento: Record<FormaPagamento, string> = {
  DINHEIRO: 'Dinheiro',
  CARTAO: 'Cartão (maquininha)',
  PIX: 'PIX na hora',
}

export const nomeDoTipo: Record<TipoEntrega, string> = {
  ENTREGA: 'Entrega',
  RETIRADA: 'Retirada no balcão',
}

export function somenteDigitos(texto: string): string {
  return texto.replace(/\D/g, '')
}

export function formatarTelefone(digitos: string): string {
  const d = somenteDigitos(digitos)
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return d
}

export function subtotalDoItem(item: ItemDoPedido): number {
  const unitario = item.adicionais.reduce(
    (soma, a) => soma + emCentavos(a.preco),
    emCentavos(item.precoUnitario),
  )
  return unitario * item.quantidade
}

const CHAVE_ULTIMO_PEDIDO = 'acai-da-orla:ultimo-pedido'

export function guardarUltimoPedido(pedido: Pedido) {
  try {
    sessionStorage.setItem(CHAVE_ULTIMO_PEDIDO, JSON.stringify(pedido))
  } catch {
    // Sem sessionStorage (aba anônima restrita) a confirmação só não sobrevive a um recarregamento.
  }
}

export function lerUltimoPedido(): Pedido | null {
  try {
    const salvo = sessionStorage.getItem(CHAVE_ULTIMO_PEDIDO)
    return salvo ? (JSON.parse(salvo) as Pedido) : null
  } catch {
    return null
  }
}
