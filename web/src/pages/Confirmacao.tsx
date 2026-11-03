import { useState } from 'react'
import { Link, Navigate } from 'react-router'
import { lerUltimoPedido, nomeDoPagamento, nomeDoTipo, subtotalDoItem } from '../lib/pedido.ts'
import { formatarCentavos, formatarPreco } from '../lib/preco.ts'
import { linkDoWhatsApp, mensagemDoPedido } from '../lib/whatsapp.ts'

export default function Confirmacao() {
  const [pedido] = useState(lerUltimoPedido)

  if (!pedido) return <Navigate to="/" replace />

  return (
    <section className="mt-6">
      <div className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-acai-100">
        <p className="text-5xl" aria-hidden>
          🎉
        </p>
        <h1 className="mt-2 text-2xl font-extrabold">Pedido recebido!</h1>
        <p className="mt-1 text-acai-700">
          Número do pedido <strong className="text-acai-900">#{pedido.id}</strong>
        </p>

        <a
          href={linkDoWhatsApp(mensagemDoPedido(pedido))}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex items-center justify-center gap-2 rounded-full bg-[#1f8f4e] px-5 py-3 font-bold text-white shadow hover:bg-[#187a42]"
        >
          <span aria-hidden>💬</span> Enviar no WhatsApp
        </a>
        <p className="mt-2 text-xs text-acai-600">
          Manda o resumo para a loja e acompanha por lá.
        </p>
      </div>

      <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-acai-100">
        <h2 className="font-bold">Resumo</h2>
        <ul className="mt-2 divide-y divide-acai-100">
          {pedido.itens.map((item) => (
            <li key={item.id} className="flex justify-between gap-3 py-2 text-sm">
              <span>
                {item.quantidade}x {item.produto.nome} · {item.tamanho.nome}
                {item.adicionais.length > 0 && (
                  <span className="block text-acai-600">
                    + {item.adicionais.map((a) => a.adicional.nome).join(', ')}
                  </span>
                )}
              </span>
              <span className="shrink-0 font-semibold">
                {formatarCentavos(subtotalDoItem(item))}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-2 flex justify-between border-t border-acai-200 pt-3 text-lg font-extrabold">
          <span>Total</span>
          <span>{formatarPreco(pedido.total)}</span>
        </div>
        <dl className="mt-3 space-y-1 text-sm text-acai-700">
          <div>
            <dt className="inline font-semibold">{nomeDoTipo[pedido.tipo]}</dt>
            {pedido.endereco && <dd className="inline">: {pedido.endereco}</dd>}
          </div>
          <div>
            <dt className="inline font-semibold">Pagamento: </dt>
            <dd className="inline">{nomeDoPagamento[pedido.pagamento]}</dd>
          </div>
        </dl>
      </div>

      <Link to="/" className="mt-6 block text-center font-semibold text-acai-700 underline">
        Voltar ao cardápio
      </Link>
    </section>
  )
}
