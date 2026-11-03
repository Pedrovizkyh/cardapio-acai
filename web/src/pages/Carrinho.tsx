import { useState, type FormEvent, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router'
import { mensagemDeErro } from '../api/cliente.ts'
import { useCriarPedido } from '../api/pedidos.ts'
import type { FormaPagamento, TipoEntrega } from '../api/tipos.ts'
import {
  subtotalEmCentavos,
  totalEmCentavos,
  useCarrinho,
  type ItemCarrinho,
} from '../carrinho/carrinho.ts'
import BarraInferior, { botaoPrincipal } from '../components/BarraInferior.tsx'
import BotaoVoltar from '../components/BotaoVoltar.tsx'
import ImagemProduto from '../components/ImagemProduto.tsx'
import Tigela from '../components/Tigela.tsx'
import { guardarUltimoPedido, nomeDoPagamento, somenteDigitos } from '../lib/pedido.ts'
import { formatarCentavos } from '../lib/preco.ts'

type Erros = Partial<Record<'cliente' | 'telefone' | 'endereco', string>>

// A API aceita até 200 caracteres no endereço; o complemento vai junto.
const LIMITE_ENDERECO = 140
const LIMITE_COMPLEMENTO = 57

const rotuloDoTipo: Record<TipoEntrega, string> = { ENTREGA: 'Entrega', RETIRADA: 'Retirada' }

const campo =
  'h-13 w-full rounded-2xl bg-white px-4 ring-1 ring-acai-200 transition placeholder:text-acai-400 focus:outline-2 focus:outline-acai-500 aria-invalid:ring-2 aria-invalid:ring-perigo'

export default function Carrinho() {
  const itens = useCarrinho((estado) => estado.itens)

  return (
    <div className="pt-5">
      <div className="flex items-center gap-4">
        <BotaoVoltar para="/" rotulo="Voltar ao cardápio" />
        <h1 className="text-[1.75rem] font-extrabold">Seu pedido</h1>
      </div>
      {itens.length === 0 ? <PedidoVazio /> : <FormularioPedido itens={itens} />}
    </div>
  )
}

function PedidoVazio() {
  return (
    <section className="mt-12 text-center">
      <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-[28px] bg-acai-100">
        <Tigela esgotado className="w-20" />
      </div>
      <h2 className="mt-5 text-xl font-bold">Seu pedido está vazio</h2>
      <p className="mt-1 text-texto-suave">Que tal um açaí geladinho?</p>
      <Link
        to="/"
        className="mt-6 inline-flex h-13 items-center rounded-2xl bg-acai-950 px-6 font-bold text-white transition hover:bg-acai-800"
      >
        Ver cardápio
      </Link>
    </section>
  )
}

function FormularioPedido({ itens }: { itens: ItemCarrinho[] }) {
  const navigate = useNavigate()
  const limpar = useCarrinho((estado) => estado.limpar)
  const criarPedido = useCriarPedido()

  const [tipo, setTipo] = useState<TipoEntrega>('ENTREGA')
  const [cliente, setCliente] = useState('')
  const [telefone, setTelefone] = useState('')
  const [endereco, setEndereco] = useState('')
  const [complemento, setComplemento] = useState('')
  const [pagamento, setPagamento] = useState<FormaPagamento>('PIX')
  const [erros, setErros] = useState<Erros>({})

  const total = formatarCentavos(totalEmCentavos(itens))

  function limparErro(nome: keyof Erros) {
    setErros((atuais) => ({ ...atuais, [nome]: undefined }))
  }

  function validar(): Erros {
    const novos: Erros = {}
    if (!cliente.trim()) novos.cliente = 'Diga seu nome.'
    const digitos = somenteDigitos(telefone)
    if (digitos.length < 10 || digitos.length > 11) {
      novos.telefone = 'WhatsApp com DDD, ex.: (13) 99999-8888.'
    }
    if (tipo === 'ENTREGA' && !endereco.trim()) novos.endereco = 'Informe o endereço da entrega.'
    return novos
  }

  function enviar(evento: FormEvent) {
    evento.preventDefault()
    const encontrados = validar()
    setErros(encontrados)
    const primeiro = Object.keys(encontrados)[0]
    if (primeiro) {
      document.getElementById(primeiro)?.focus()
      return
    }

    const enderecoCompleto = [endereco.trim(), complemento.trim()].filter(Boolean).join(' — ')

    criarPedido.mutate(
      {
        cliente: cliente.trim(),
        telefone: somenteDigitos(telefone),
        tipo,
        endereco: tipo === 'ENTREGA' ? enderecoCompleto : undefined,
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
      <ul className="mt-5 space-y-3">
        {itens.map((item) => (
          <LinhaDoItem key={item.chave} item={item} />
        ))}
      </ul>
      <Link to="/" className="mt-3 inline-block px-1 text-sm font-bold text-acai-800 underline-offset-4 hover:underline">
        + Adicionar mais itens
      </Link>

      <fieldset className="mt-7">
        <legend className="titulo-secao mb-3">Como quer receber?</legend>
        <div className="grid grid-cols-2 gap-1 rounded-2xl bg-acai-100 p-1.5">
          {(['ENTREGA', 'RETIRADA'] as const).map((t) => (
            <label
              key={t}
              className="flex h-12 cursor-pointer items-center justify-center rounded-xl font-bold text-acai-950/80 transition has-checked:bg-white has-checked:text-acai-950 has-checked:shadow-sm has-focus-visible:outline-2 has-focus-visible:outline-acai-500"
            >
              <input
                type="radio"
                name="tipo"
                className="sr-only"
                checked={tipo === t}
                onChange={() => setTipo(t)}
              />
              {rotuloDoTipo[t]}
            </label>
          ))}
        </div>
      </fieldset>

      <h2 className="titulo-secao mt-7">Seus dados</h2>
      <div className="mt-3 space-y-4">
        <Campo id="cliente" rotulo="Nome" erro={erros.cliente}>
          <input
            id="cliente"
            value={cliente}
            onChange={(e) => {
              setCliente(e.target.value)
              limparErro('cliente')
            }}
            autoComplete="name"
            maxLength={80}
            placeholder="Como devemos te chamar?"
            aria-invalid={!!erros.cliente}
            aria-describedby="erro-cliente"
            className={campo}
          />
        </Campo>

        <Campo id="telefone" rotulo="WhatsApp" erro={erros.telefone}>
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
            placeholder="(13) 90000-0000"
            aria-invalid={!!erros.telefone}
            aria-describedby="erro-telefone"
            className={campo}
          />
        </Campo>

        {tipo === 'ENTREGA' && (
          <>
            <Campo id="endereco" rotulo="Endereço" erro={erros.endereco}>
              <input
                id="endereco"
                value={endereco}
                onChange={(e) => {
                  setEndereco(e.target.value)
                  limparErro('endereco')
                }}
                autoComplete="street-address"
                maxLength={LIMITE_ENDERECO}
                placeholder="Rua, número e bairro"
                aria-invalid={!!erros.endereco}
                aria-describedby="erro-endereco"
                className={campo}
              />
            </Campo>
            <Campo id="complemento" rotulo="Complemento">
              <input
                id="complemento"
                value={complemento}
                onChange={(e) => setComplemento(e.target.value)}
                maxLength={LIMITE_COMPLEMENTO}
                placeholder="Apto, bloco, ponto de referência"
                className={campo}
              />
            </Campo>
          </>
        )}
      </div>

      <fieldset className="mt-7">
        <legend className="titulo-secao mb-3">
          Pagamento na {tipo === 'ENTREGA' ? 'entrega' : 'retirada'}
        </legend>
        <div className="divide-y divide-acai-100 overflow-hidden rounded-3xl bg-white ring-1 ring-acai-100">
          {(Object.keys(nomeDoPagamento) as FormaPagamento[]).map((p) => (
            <label key={p} className="flex cursor-pointer items-center gap-3.5 px-4 py-4 transition hover:bg-acai-50">
              <input
                type="radio"
                name="pagamento"
                checked={pagamento === p}
                onChange={() => setPagamento(p)}
                className="h-6 w-6 shrink-0 cursor-pointer appearance-none rounded-full border-2 border-acai-300 bg-white transition checked:border-[7px] checked:border-acai-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acai-500"
              />
              {nomeDoPagamento[p]}
            </label>
          ))}
        </div>
      </fieldset>

      <dl className="mt-7 rounded-3xl bg-white p-5 ring-1 ring-acai-100">
        <div className="flex justify-between text-texto-suave">
          <dt>Subtotal</dt>
          <dd>{total}</dd>
        </div>
        <div className="mt-3 flex justify-between border-t border-acai-100 pt-3 text-xl font-bold">
          <dt>Total</dt>
          <dd>{total}</dd>
        </div>
        <p className="mt-2 text-xs text-texto-suave">O valor final é conferido pela loja ao receber o pedido.</p>
      </dl>

      {criarPedido.isError && (
        <p role="alert" className="mt-5 rounded-2xl bg-red-50 p-4 font-semibold text-perigo ring-1 ring-red-200">
          Não deu para enviar o pedido: {mensagemDeErro(criarPedido.error)}
        </p>
      )}

      <BarraInferior>
        <button type="submit" disabled={criarPedido.isPending} className={botaoPrincipal}>
          <span>{criarPedido.isPending ? 'Enviando...' : 'Fazer pedido'}</span>
          <span className="text-lima-400">{total}</span>
        </button>
      </BarraInferior>
    </form>
  )
}

function LinhaDoItem({ item }: { item: ItemCarrinho }) {
  const remover = useCarrinho((estado) => estado.remover)

  return (
    <li className="flex gap-4 rounded-3xl bg-white p-4 ring-1 ring-acai-100">
      <ImagemProduto
        imagem={item.imagem ?? null}
        nome={item.produtoNome}
        id={item.produtoId}
        className="h-16 w-16 shrink-0 rounded-2xl"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <p className="font-bold leading-snug">
            {item.quantidade}× {item.produtoNome} {item.tamanhoNome}
          </p>
          <p className="shrink-0 font-bold">{formatarCentavos(subtotalEmCentavos(item))}</p>
        </div>
        {item.adicionais.length > 0 && (
          <p className="mt-0.5 text-sm text-texto-suave">{item.adicionais.map((a) => a.nome).join(', ')}</p>
        )}
        {item.observacao && <p className="mt-0.5 text-sm text-texto-suave italic">“{item.observacao}”</p>}
        <div className="mt-2 flex gap-4 text-sm font-bold">
          <Link
            to={`/produto/${item.produtoId}?item=${encodeURIComponent(item.chave)}`}
            className="text-acai-800 underline underline-offset-4"
            aria-label={`Editar ${item.produtoNome}`}
          >
            Editar
          </Link>
          <button
            type="button"
            onClick={() => remover(item.chave)}
            className="text-perigo hover:underline hover:underline-offset-4"
            aria-label={`Remover ${item.produtoNome}`}
          >
            Remover
          </button>
        </div>
      </div>
    </li>
  )
}

type CampoProps = { id: string; rotulo: string; erro?: string; children: ReactNode }

function Campo({ id, rotulo, erro, children }: CampoProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-bold">
        {rotulo}
      </label>
      {children}
      {erro !== undefined && (
        <p id={`erro-${id}`} className="mt-1.5 text-sm font-semibold text-perigo">
          {erro}
        </p>
      )}
    </div>
  )
}
