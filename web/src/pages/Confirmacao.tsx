import { useState } from 'react'
import { Link, Navigate } from 'react-router'
import type { StatusPedido } from '../api/tipos.ts'
import Icone from '../components/Icone.tsx'
import { numeroDoPedido } from '../lib/loja.ts'
import { lerUltimoPedido, nomeDoPagamento, nomeDoStatus, subtotalDoItem } from '../lib/pedido.ts'
import { formatarCentavos, formatarPreco } from '../lib/preco.ts'
import { linkDoWhatsApp, mensagemDoPedido } from '../lib/whatsapp.ts'

const etapasEntrega: StatusPedido[] = ['RECEBIDO', 'EM_PREPARO', 'SAIU_PARA_ENTREGA', 'ENTREGUE']
const etapasRetirada: StatusPedido[] = ['RECEBIDO', 'EM_PREPARO', 'PRONTO', 'ENTREGUE']

export default function Confirmacao() {
  const [pedido] = useState(lerUltimoPedido)

  if (!pedido) return <Navigate to="/" replace />

  const entrega = pedido.tipo === 'ENTREGA'
  const etapas = entrega ? etapasEntrega : etapasRetirada

  return (
    <section className="pt-10 pb-10 text-center">
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[28px] bg-lima-400 text-acai-950">
        <Icone nome="check" className="h-11 w-11 stroke-[2.5]" />
      </div>
      <p className="mt-5 text-sm font-bold text-acai-800">Pedido nº {numeroDoPedido(pedido.id)}</p>
      <h1 className="mx-auto mt-2 max-w-72 text-[2rem] leading-[1.1] font-extrabold">Recebemos seu pedido!</h1>
      <p className="mx-auto mt-3 max-w-80 text-texto-suave">
        A loja já está vendo seu pedido. Mande o resumo pelo WhatsApp se quiser combinar algum detalhe.
      </p>

      <ol className="mt-7 space-y-4 rounded-3xl bg-white p-5 text-left ring-1 ring-acai-100" aria-label="Andamento do pedido">
        {etapas.map((etapa, i) => (
          <li key={etapa} className="flex items-center gap-3">
            {i === 0 ? (
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-acai-800 text-white">
                <Icone nome="check" className="h-4 w-4 stroke-3" />
              </span>
            ) : (
              <span className="h-7 w-7 rounded-full border-2 border-acai-200" />
            )}
            <span className={`flex-1 ${i === 0 ? 'font-bold' : 'text-texto-suave'}`}>
              {etapa === 'ENTREGUE' && !entrega ? 'Retirado' : nomeDoStatus[etapa]}
            </span>
            {i === 0 && <span className="text-sm text-texto-suave">agora</span>}
          </li>
        ))}
      </ol>

      <div className="mt-3 rounded-3xl bg-white p-5 text-left ring-1 ring-acai-100">
        <ul className="space-y-2">
          {pedido.itens.map((item) => (
            <li key={item.id}>
              <div className="flex justify-between gap-3 font-bold">
                <span>
                  {item.quantidade}× {item.produto.nome} {item.tamanho.nome}
                </span>
                <span className="shrink-0">{formatarCentavos(subtotalDoItem(item))}</span>
              </div>
              {item.adicionais.length > 0 && (
                <p className="text-sm text-texto-suave">{item.adicionais.map((a) => a.adicional.nome).join(', ')}</p>
              )}
            </li>
          ))}
        </ul>
        <p className="mt-2 text-sm text-texto-suave">
          {entrega ? 'Entrega' : 'Retirada'} · {nomeDoPagamento[pedido.pagamento]} na {entrega ? 'entrega' : 'retirada'}
        </p>
        {pedido.endereco && <p className="text-sm text-texto-suave">{pedido.endereco}</p>}
        <div className="mt-3 flex justify-between border-t border-acai-100 pt-3 text-lg font-bold">
          <span>Total</span>
          <span>{formatarPreco(pedido.total)}</span>
        </div>
      </div>

      <a
        href={linkDoWhatsApp(mensagemDoPedido(pedido))}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 flex h-14 items-center justify-center gap-2.5 rounded-2xl bg-whats text-lg font-bold text-white shadow-lg shadow-whats/20 transition hover:brightness-110"
      >
        <Icone nome="conversa" className="h-5 w-5" /> Enviar resumo no WhatsApp
      </a>
      <Link
        to="/"
        className="mt-3 flex h-14 items-center justify-center rounded-2xl bg-white font-bold ring-1 ring-acai-200 transition hover:bg-acai-100"
      >
        Voltar ao cardápio
      </Link>
    </section>
  )
}
