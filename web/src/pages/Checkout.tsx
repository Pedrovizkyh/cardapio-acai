import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { mensagemDeErro } from '../api/cliente.ts'
import { useCriarPedido } from '../api/pedidos.ts'
import type { FormaPagamento, TipoEntrega } from '../api/tipos.ts'
import { totalEmCentavos, useCarrinho } from '../carrinho/carrinho.ts'
import {
  guardarUltimoPedido,
  nomeDoPagamento,
  nomeDoTipo,
  somenteDigitos,
} from '../lib/pedido.ts'
import { formatarCentavos } from '../lib/preco.ts'

type Erros = Partial<Record<'cliente' | 'telefone' | 'endereco', string>>

const campo =
  'mt-1 w-full rounded-xl bg-white p-3 ring-1 ring-acai-200 focus:outline-2 focus:outline-acai-500 aria-invalid:ring-red-400'
const opcao =
  'flex cursor-pointer items-center justify-center rounded-xl bg-white p-3 text-center font-semibold ring-1 ring-acai-200 has-checked:bg-acai-700 has-checked:text-white has-checked:ring-acai-700 has-focus-visible:outline-2 has-focus-visible:outline-acai-500'

export default function Checkout() {
  const navigate = useNavigate()
  const { itens, limpar } = useCarrinho()
  const criarPedido = useCriarPedido()

  const [cliente, setCliente] = useState('')
  const [telefone, setTelefone] = useState('')
  const [tipo, setTipo] = useState<TipoEntrega>('ENTREGA')
  const [endereco, setEndereco] = useState('')
  const [pagamento, setPagamento] = useState<FormaPagamento>('PIX')
  const [erros, setErros] = useState<Erros>({})

  if (itens.length === 0 && !criarPedido.isSuccess) return <Navigate to="/carrinho" replace />

  function limparErro(nome: keyof Erros) {
    setErros((atuais) => ({ ...atuais, [nome]: undefined }))
  }

  function validar(): Erros {
    const novos: Erros = {}
    if (!cliente.trim()) novos.cliente = 'Diga seu nome.'
    const digitos = somenteDigitos(telefone)
    if (digitos.length < 10 || digitos.length > 11) {
      novos.telefone = 'Telefone com DDD, ex.: (71) 99999-8888.'
    }
    if (tipo === 'ENTREGA' && !endereco.trim()) novos.endereco = 'Informe o endereço da entrega.'
    return novos
  }

  function enviar(evento: FormEvent) {
    evento.preventDefault()
    const encontrados = validar()
    setErros(encontrados)
    if (Object.keys(encontrados).length > 0) return

    criarPedido.mutate(
      {
        cliente: cliente.trim(),
        telefone: somenteDigitos(telefone),
        tipo,
        endereco: tipo === 'ENTREGA' ? endereco.trim() : undefined,
        pagamento,
        itens: itens.map((item) => ({
          produtoId: item.produtoId,
          tamanhoId: item.tamanhoId,
          adicionais: item.adicionais.map((a) => a.id),
          quantidade: item.quantidade,
          observacao: item.observacao || undefined,
        })),
      },
      {
        onSuccess: (pedido) => {
          guardarUltimoPedido(pedido)
          navigate('/pedido/confirmado', { replace: true })
          limpar()
        },
      },
    )
  }

  return (
    <form onSubmit={enviar} noValidate className="pb-28">
      <h1 className="mt-4 text-2xl font-extrabold">Finalizar pedido</h1>

      <div className="mt-4 space-y-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-acai-100">
        <div>
          <label htmlFor="cliente" className="font-bold">Nome</label>
          <input
            id="cliente"
            value={cliente}
            onChange={(e) => {
              setCliente(e.target.value)
              limparErro('cliente')
            }}
            autoComplete="name"
            maxLength={80}
            aria-invalid={!!erros.cliente}
            aria-describedby="erro-cliente"
            className={campo}
          />
          <p id="erro-cliente" className="mt-1 text-sm text-red-700">{erros.cliente}</p>
        </div>

        <div>
          <label htmlFor="telefone" className="font-bold">Telefone (WhatsApp)</label>
          <input
            id="telefone"
            type="tel"
            inputMode="tel"
            value={telefone}
            onChange={(e) => {
              setTelefone(e.target.value)
              limparErro('telefone')
            }}
            autoComplete="tel-national"
            placeholder="(71) 99999-8888"
            aria-invalid={!!erros.telefone}
            aria-describedby="erro-telefone"
            className={campo}
          />
          <p id="erro-telefone" className="mt-1 text-sm text-red-700">{erros.telefone}</p>
        </div>
      </div>

      <fieldset className="mt-6">
        <legend className="mb-2 font-bold">Como você quer receber?</legend>
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(nomeDoTipo) as TipoEntrega[]).map((t) => (
            <label key={t} className={opcao}>
              <input
                type="radio"
                name="tipo"
                className="sr-only"
                checked={tipo === t}
                onChange={() => setTipo(t)}
              />
              {nomeDoTipo[t]}
            </label>
          ))}
        </div>
      </fieldset>

      {tipo === 'ENTREGA' && (
        <div className="mt-4">
          <label htmlFor="endereco" className="font-bold">Endereço</label>
          <textarea
            id="endereco"
            value={endereco}
            onChange={(e) => {
              setEndereco(e.target.value)
              limparErro('endereco')
            }}
            autoComplete="street-address"
            maxLength={200}
            rows={2}
            placeholder="Rua, número, bairro e ponto de referência"
            aria-invalid={!!erros.endereco}
            aria-describedby="erro-endereco"
            className={campo}
          />
          <p id="erro-endereco" className="mt-1 text-sm text-red-700">{erros.endereco}</p>
        </div>
      )}

      <fieldset className="mt-6">
        <legend className="mb-2 font-bold">Pagamento na entrega</legend>
        <div className="grid grid-cols-3 gap-2 text-sm">
          {(Object.keys(nomeDoPagamento) as FormaPagamento[]).map((p) => (
            <label key={p} className={opcao}>
              <input
                type="radio"
                name="pagamento"
                className="sr-only"
                checked={pagamento === p}
                onChange={() => setPagamento(p)}
              />
              {nomeDoPagamento[p]}
            </label>
          ))}
        </div>
      </fieldset>

      {criarPedido.isError && (
        <p role="alert" className="mt-6 rounded-xl bg-red-50 p-4 font-semibold text-red-800 ring-1 ring-red-200">
          Não deu para enviar o pedido: {mensagemDeErro(criarPedido.error)}
        </p>
      )}

      <div className="fixed inset-x-0 bottom-0 border-t border-acai-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center gap-4 px-4 py-3">
          <div>
            <p className="text-xs text-acai-600">Total estimado</p>
            <p className="text-lg font-extrabold">{formatarCentavos(totalEmCentavos(itens))}</p>
          </div>
          <button
            type="submit"
            disabled={criarPedido.isPending}
            className="flex-1 rounded-full bg-acai-700 px-5 py-3 font-bold text-white shadow hover:bg-acai-800 disabled:opacity-60"
          >
            {criarPedido.isPending ? 'Enviando...' : 'Enviar pedido'}
          </button>
        </div>
      </div>
    </form>
  )
}
