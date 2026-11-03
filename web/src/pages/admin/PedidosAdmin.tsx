import { useState } from 'react'
import { useMudarStatus, usePedidosAdmin } from '../../api/admin.ts'
import { mensagemDeErro } from '../../api/cliente.ts'
import type { PedidoAdmin, StatusPedido } from '../../api/tipos.ts'
import { MensagemErro } from '../../components/Estados.tsx'
import {
  acaoDoStatus,
  formatarTelefone,
  nomeDoPagamento,
  nomeDoStatus,
  nomeDoTipo,
} from '../../lib/pedido.ts'
import { formatarPreco } from '../../lib/preco.ts'

const abas: { status: StatusPedido | null; rotulo: string }[] = [
  { status: 'RECEBIDO', rotulo: 'Recebidos' },
  { status: 'EM_PREPARO', rotulo: 'Em preparo' },
  { status: 'PRONTO', rotulo: 'Prontos' },
  { status: 'SAIU_PARA_ENTREGA', rotulo: 'Saiu' },
  { status: 'ENTREGUE', rotulo: 'Entregues' },
  { status: 'CANCELADO', rotulo: 'Cancelados' },
  { status: null, rotulo: 'Todos' },
]

const corDoStatus: Record<StatusPedido, string> = {
  RECEBIDO: 'bg-lima-300 text-acai-900',
  EM_PREPARO: 'bg-amber-200 text-amber-900',
  PRONTO: 'bg-sky-200 text-sky-900',
  SAIU_PARA_ENTREGA: 'bg-indigo-200 text-indigo-900',
  ENTREGUE: 'bg-emerald-200 text-emerald-900',
  CANCELADO: 'bg-red-200 text-red-900',
}

const hora = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
})

export default function PedidosAdmin() {
  const [status, setStatus] = useState<StatusPedido | null>('RECEBIDO')
  const { data, isPending, isError, error, refetch, isFetching, dataUpdatedAt } =
    usePedidosAdmin(status)

  return (
    <section>
      <nav
        aria-label="Filtrar por status"
        className="-mx-4 flex gap-2 overflow-x-auto px-4 py-3"
      >
        {abas.map((aba) => (
          <button
            key={aba.rotulo}
            type="button"
            onClick={() => setStatus(aba.status)}
            aria-pressed={status === aba.status}
            className="shrink-0 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-acai-800 ring-1 ring-acai-200 aria-pressed:bg-acai-700 aria-pressed:text-white aria-pressed:ring-acai-700"
          >
            {aba.rotulo}
          </button>
        ))}
      </nav>

      <p className="text-xs text-acai-600" aria-live="polite">
        {isFetching
          ? 'Atualizando...'
          : dataUpdatedAt > 0 &&
            `Atualizado às ${new Date(dataUpdatedAt).toLocaleTimeString('pt-BR')} · atualiza sozinho a cada 15 s`}
      </p>

      {isPending && <p className="mt-6 text-acai-700">Carregando pedidos...</p>}
      {isError && (
        <MensagemErro mensagem={mensagemDeErro(error)} onTentarDeNovo={() => void refetch()} />
      )}
      {data?.length === 0 && (
        <p className="mt-10 text-center text-acai-700">Nenhum pedido aqui por enquanto. 🍇</p>
      )}

      <ul className="mt-3 space-y-3">
        {data?.map((pedido) => (
          <CardPedido key={pedido.id} pedido={pedido} />
        ))}
      </ul>
    </section>
  )
}

function CardPedido({ pedido }: { pedido: PedidoAdmin }) {
  const mudarStatus = useMudarStatus()
  const [confirmandoCancelamento, setConfirmandoCancelamento] = useState(false)
  const avancos = pedido.proximosStatus.filter((s) => s !== 'CANCELADO')
  const podeCancelar = pedido.proximosStatus.includes('CANCELADO')

  function mudar(novo: StatusPedido) {
    setConfirmandoCancelamento(false)
    mudarStatus.mutate({ id: pedido.id, status: novo })
  }

  return (
    <li className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-acai-100">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-lg font-extrabold">#{pedido.id} · {pedido.cliente}</p>
          <p className="text-sm text-acai-700">
            {hora.format(new Date(pedido.criadoEm))} ·{' '}
            <a href={`tel:${pedido.telefone}`} className="underline">
              {formatarTelefone(pedido.telefone)}
            </a>
          </p>
        </div>
        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${corDoStatus[pedido.status]}`}>
          {nomeDoStatus[pedido.status]}
        </span>
      </div>

      <p className="mt-2 text-sm">
        <strong>{nomeDoTipo[pedido.tipo]}</strong>
        {pedido.endereco && <> · {pedido.endereco}</>}
      </p>

      <ul className="mt-2 space-y-1 border-t border-acai-100 pt-2 text-sm">
        {pedido.itens.map((item) => (
          <li key={item.id}>
            <strong>{item.quantidade}x</strong> {item.produto.nome} ({item.tamanho.nome})
            {item.adicionais.length > 0 && (
              <span className="text-acai-700">
                {' '}+ {item.adicionais.map((a) => a.adicional.nome).join(', ')}
              </span>
            )}
            {item.observacao && (
              <span className="block pl-6 italic text-acai-600">“{item.observacao}”</span>
            )}
          </li>
        ))}
      </ul>

      <p className="mt-2 flex justify-between border-t border-acai-100 pt-2">
        <span className="text-sm text-acai-700">{nomeDoPagamento[pedido.pagamento]}</span>
        <strong>{formatarPreco(pedido.total)}</strong>
      </p>

      {mudarStatus.isError && (
        <p role="alert" className="mt-2 rounded-lg bg-red-50 p-2 text-sm font-semibold text-red-800">
          {mensagemDeErro(mudarStatus.error)}
        </p>
      )}

      {(avancos.length > 0 || podeCancelar) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {avancos.map((s) => (
            <button
              key={s}
              type="button"
              disabled={mudarStatus.isPending}
              onClick={() => mudar(s)}
              className="flex-1 rounded-full bg-acai-700 px-4 py-2 font-bold text-white hover:bg-acai-800 disabled:opacity-60"
            >
              {acaoDoStatus[s]} →
            </button>
          ))}
          {podeCancelar &&
            (confirmandoCancelamento ? (
              <>
                <button
                  type="button"
                  disabled={mudarStatus.isPending}
                  onClick={() => mudar('CANCELADO')}
                  className="rounded-full bg-red-700 px-4 py-2 font-bold text-white hover:bg-red-800"
                >
                  Confirmar cancelamento
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmandoCancelamento(false)}
                  className="rounded-full px-4 py-2 font-semibold text-acai-700"
                >
                  Voltar
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmandoCancelamento(true)}
                className="rounded-full px-4 py-2 font-semibold text-red-700 ring-1 ring-red-200 hover:bg-red-50"
              >
                Cancelar
              </button>
            ))}
        </div>
      )}
    </li>
  )
}
