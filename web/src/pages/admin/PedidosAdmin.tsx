import { useState } from 'react'
import { useMudarStatus, usePedidosAdmin } from '../../api/admin.ts'
import { mensagemDeErro } from '../../api/cliente.ts'
import type { PedidoAdmin, StatusPedido } from '../../api/tipos.ts'
import { estilos } from '../../admin/estilos.ts'
import { MensagemErro } from '../../components/Estados.tsx'
import { numeroDoPedido } from '../../lib/loja.ts'
import { acaoDoStatus, formatarTelefone, nomeDoPagamento, nomeDoStatus } from '../../lib/pedido.ts'
import { emCentavos, formatarCentavos, formatarPreco } from '../../lib/preco.ts'

const colunas: { titulo: string; cor: string; status: StatusPedido[] }[] = [
  { titulo: 'Recebidos', cor: 'bg-orange-500', status: ['RECEBIDO'] },
  { titulo: 'Em preparo', cor: 'bg-acai-800', status: ['EM_PREPARO'] },
  { titulo: 'Prontos', cor: 'bg-emerald-600', status: ['PRONTO', 'SAIU_PARA_ENTREGA'] },
]

const hora = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' })

function ehDeHoje(data: string) {
  return new Date(data).toDateString() === new Date().toDateString()
}

export default function PedidosAdmin() {
  const { data, isPending, isError, error, refetch, isFetching } = usePedidosAdmin(null)

  // A API devolve os pedidos mais recentes de todos os status; o painel separa os de hoje.
  const deHoje = data?.filter((p) => ehDeHoje(p.criadoEm)) ?? []
  const validos = deHoje.filter((p) => p.status !== 'CANCELADO')
  const vendidos = validos.reduce((soma, p) => soma + emCentavos(p.total), 0)
  const finalizados = deHoje.filter((p) => p.status === 'ENTREGUE' || p.status === 'CANCELADO')

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className={estilos.titulo}>Pedidos de hoje</h1>
          <p className={estilos.subtitulo} aria-live="polite">
            {isFetching && !isPending ? 'Atualizando...' : 'Atualiza sozinho a cada 15 segundos'}
          </p>
        </div>
        {data && (
          <div className="flex gap-2 text-sm">
            <span className="rounded-full bg-white px-4 py-2 ring-1 ring-acai-200">
              <strong>{validos.length}</strong> {validos.length === 1 ? 'pedido' : 'pedidos'}
            </span>
            <span className="rounded-full bg-lima-400 px-4 py-2">
              <strong>{formatarCentavos(vendidos)}</strong> vendidos
            </span>
          </div>
        )}
      </div>

      {isPending && (
        <div aria-busy="true" aria-label="Carregando" className="mt-6 grid gap-4 md:grid-cols-3">
          {colunas.map((c) => (
            <div key={c.titulo} className="h-64 animate-pulse rounded-3xl bg-acai-100" />
          ))}
        </div>
      )}
      {isError && <MensagemErro mensagem={mensagemDeErro(error)} onTentarDeNovo={() => void refetch()} />}

      {data && (
        <>
          <div className="mt-6 grid items-start gap-4 md:grid-cols-3">
            {colunas.map((coluna) => {
              const pedidos = deHoje
                .filter((p) => coluna.status.includes(p.status))
                .sort((a, b) => a.criadoEm.localeCompare(b.criadoEm))
              return (
                <section key={coluna.titulo} className="rounded-3xl bg-acai-100 p-3" aria-label={coluna.titulo}>
                  <h2 className="flex items-center gap-2.5 px-1.5 pt-1 pb-3 font-sans font-bold">
                    <span aria-hidden className={`h-2.5 w-2.5 rounded-full ${coluna.cor}`} />
                    <span className="flex-1">{coluna.titulo}</span>
                    <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-white px-2 text-sm">
                      {pedidos.length}
                    </span>
                  </h2>
                  {pedidos.length === 0 ? (
                    <p className="rounded-2xl border-2 border-dashed border-acai-200 px-4 py-8 text-center text-sm text-texto-suave">
                      Nada por aqui agora.
                    </p>
                  ) : (
                    <ul className="space-y-3">
                      {pedidos.map((pedido) => (
                        <CardPedido key={pedido.id} pedido={pedido} />
                      ))}
                    </ul>
                  )}
                </section>
              )
            })}
          </div>

          {finalizados.length > 0 && <Finalizados pedidos={finalizados} />}
        </>
      )}
    </section>
  )
}

function resumoDosItens(pedido: PedidoAdmin) {
  return pedido.itens.map((item) => {
    const adicionais = item.adicionais.map((a) => a.adicional.nome)
    return [`${item.quantidade}× ${item.produto.nome} ${item.tamanho.nome}`, ...adicionais].join(' · ')
  })
}

function CardPedido({ pedido }: { pedido: PedidoAdmin }) {
  const mudarStatus = useMudarStatus()
  const [confirmandoCancelamento, setConfirmandoCancelamento] = useState(false)
  const avancos = pedido.proximosStatus.filter((s) => s !== 'CANCELADO')
  const podeCancelar = pedido.proximosStatus.includes('CANCELADO')
  const entrega = pedido.tipo === 'ENTREGA'

  function mudar(novo: StatusPedido) {
    setConfirmandoCancelamento(false)
    mudarStatus.mutate({ id: pedido.id, status: novo })
  }

  return (
    <li className="rounded-2xl bg-white p-4 shadow-sm shadow-acai-950/5">
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-display text-xl font-extrabold">#{numeroDoPedido(pedido.id)}</p>
        <p className="text-sm text-texto-suave">
          {hora.format(new Date(pedido.criadoEm))} · {entrega ? 'Entrega' : 'Retirada'}
        </p>
      </div>
      {pedido.status === 'SAIU_PARA_ENTREGA' && (
        <p className="mt-1 inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
          A caminho
        </p>
      )}
      <p className="mt-2 font-bold">{pedido.cliente}</p>
      <p className="text-sm text-texto-suave">{entrega ? pedido.endereco : 'Retira na loja'}</p>
      <p className="text-sm text-texto-suave">
        <a href={`tel:${pedido.telefone}`} className="underline-offset-2 hover:underline">
          {formatarTelefone(pedido.telefone)}
        </a>
      </p>

      <ul className="mt-3 space-y-1 rounded-xl bg-acai-50 px-3.5 py-3 text-[15px]">
        {resumoDosItens(pedido).map((linha, i) => (
          <li key={i}>{linha}</li>
        ))}
        {pedido.itens
          .filter((item) => item.observacao)
          .map((item) => (
            <li key={`obs-${item.id}`} className="text-sm text-texto-suave italic">
              “{item.observacao}”
            </li>
          ))}
      </ul>

      <p className="mt-3 flex items-baseline justify-between">
        <span className="text-sm text-texto-suave">
          {nomeDoPagamento[pedido.pagamento]} na {entrega ? 'entrega' : 'retirada'}
        </span>
        <strong className="text-lg">{formatarPreco(pedido.total)}</strong>
      </p>

      {mudarStatus.isError && (
        <p role="alert" className="mt-2 rounded-xl bg-red-50 p-3 text-sm font-semibold text-perigo">
          {mensagemDeErro(mudarStatus.error)}
        </p>
      )}

      {(avancos.length > 0 || podeCancelar) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {confirmandoCancelamento ? (
            <>
              <button
                type="button"
                disabled={mudarStatus.isPending}
                onClick={() => mudar('CANCELADO')}
                className="h-11 flex-1 rounded-xl bg-perigo px-4 text-sm font-bold text-white hover:brightness-110"
              >
                Confirmar cancelamento
              </button>
              <button type="button" onClick={() => setConfirmandoCancelamento(false)} className={estilos.botaoLeve}>
                Voltar
              </button>
            </>
          ) : (
            <>
              {avancos.map((s) => (
                <button
                  key={s}
                  type="button"
                  disabled={mudarStatus.isPending}
                  onClick={() => mudar(s)}
                  className={`${estilos.botao} flex-1`}
                >
                  {acaoDoStatus[s]}
                </button>
              ))}
              {podeCancelar && (
                <button
                  type="button"
                  onClick={() => setConfirmandoCancelamento(true)}
                  className={estilos.botaoPerigo}
                >
                  Cancelar
                </button>
              )}
            </>
          )}
        </div>
      )}
    </li>
  )
}

function Finalizados({ pedidos }: { pedidos: PedidoAdmin[] }) {
  return (
    <details className="group mt-6 rounded-3xl bg-white ring-1 ring-acai-100">
      <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 font-bold">
        Finalizados hoje ({pedidos.length})
        <span aria-hidden className="text-texto-suave transition group-open:rotate-180">
          ▾
        </span>
      </summary>
      <ul className="divide-y divide-acai-100 border-t border-acai-100">
        {pedidos.map((p) => (
          <li key={p.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3 text-sm">
            <strong className="font-display text-base">#{numeroDoPedido(p.id)}</strong>
            <span className="flex-1">{p.cliente}</span>
            <span className="text-texto-suave">{hora.format(new Date(p.criadoEm))}</span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                p.status === 'CANCELADO' ? 'bg-red-100 text-perigo' : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {nomeDoStatus[p.status]}
            </span>
            <strong className={p.status === 'CANCELADO' ? 'text-texto-suave line-through' : ''}>
              {formatarPreco(p.total)}
            </strong>
          </li>
        ))}
      </ul>
    </details>
  )
}
