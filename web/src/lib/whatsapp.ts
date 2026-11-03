import type { Pedido } from '../api/tipos.ts'
import { formatarTelefone, nomeDoPagamento, subtotalDoItem } from './pedido.ts'
import { formatarCentavos, formatarPreco } from './preco.ts'

export function mensagemDoPedido(pedido: Pedido): string {
  const linhas = [`Olá! Acabei de fazer o pedido *#${pedido.id}* no Açaí da Orla 🍇`, '']

  for (const item of pedido.itens) {
    linhas.push(
      `${item.quantidade}x ${item.produto.nome} (${item.tamanho.nome}) — ${formatarCentavos(subtotalDoItem(item))}`,
    )
    if (item.adicionais.length > 0) {
      linhas.push(`   + ${item.adicionais.map((a) => a.adicional.nome).join(', ')}`)
    }
    if (item.observacao) linhas.push(`   Obs.: ${item.observacao}`)
  }

  linhas.push(
    '',
    `*Total: ${formatarPreco(pedido.total)}*`,
    pedido.tipo === 'ENTREGA' ? `Entrega: ${pedido.endereco}` : 'Retirada no balcão',
    `Pagamento: ${nomeDoPagamento[pedido.pagamento]}`,
    `Nome: ${pedido.cliente} · ${formatarTelefone(pedido.telefone)}`,
  )

  return linhas.join('\n')
}

export function linkDoWhatsApp(mensagem: string): string {
  const numero = (import.meta.env.VITE_WHATSAPP_NUMERO ?? '').replace(/\D/g, '')
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`
}
