import { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router'
import { useProduto } from '../api/cardapio.ts'
import { mensagemDeErro } from '../api/cliente.ts'
import type { ProdutoDetalhe } from '../api/tipos.ts'
import {
  precoUnitarioEmCentavos,
  QUANTIDADE_MAXIMA,
  useCarrinho,
  type ItemCarrinho,
} from '../carrinho/carrinho.ts'
import BarraInferior, { botaoPrincipal } from '../components/BarraInferior.tsx'
import BotaoVoltar from '../components/BotaoVoltar.tsx'
import { MensagemErro } from '../components/Estados.tsx'
import Icone from '../components/Icone.tsx'
import ImagemProduto from '../components/ImagemProduto.tsx'
import Quantidade from '../components/Quantidade.tsx'
import { formatarCentavos, formatarPreco } from '../lib/preco.ts'

export default function Montagem() {
  const id = Number(useParams().id)
  const chaveEmEdicao = useSearchParams()[0].get('item')
  const itemEmEdicao = useCarrinho((estado) => estado.itens.find((i) => i.chave === chaveEmEdicao))
  const { data: produto, isPending, isError, error, refetch } = useProduto(id)

  if (isPending) {
    return (
      <div aria-busy="true" aria-label="Carregando" className="animate-pulse">
        <div className="-mx-4 h-60 bg-acai-200" />
        <div className="mt-6 h-8 w-2/3 rounded-xl bg-acai-100" />
        <div className="mt-3 h-4 w-full rounded bg-acai-100" />
      </div>
    )
  }
  if (isError) {
    return (
      <div className="pt-5">
        <BotaoVoltar para="/" rotulo="Voltar ao cardápio" />
        <MensagemErro
          mensagem={`Este produto não está disponível. ${mensagemDeErro(error)}`}
          onTentarDeNovo={() => void refetch()}
        />
      </div>
    )
  }

  return (
    <FormularioMontagem
      key={`${produto.id}:${itemEmEdicao?.chave ?? ''}`}
      produto={produto}
      itemEmEdicao={itemEmEdicao?.produtoId === produto.id ? itemEmEdicao : undefined}
    />
  )
}

type FormularioProps = { produto: ProdutoDetalhe; itemEmEdicao?: ItemCarrinho }

function FormularioMontagem({ produto, itemEmEdicao }: FormularioProps) {
  const navigate = useNavigate()
  const { adicionar, substituir } = useCarrinho()

  const [tamanhoId, setTamanhoId] = useState(() => {
    const anterior = produto.tamanhos.find((t) => t.id === itemEmEdicao?.tamanhoId)
    return (anterior ?? produto.tamanhos[0])?.id
  })
  const [adicionaisMarcados, setAdicionaisMarcados] = useState<number[]>(() =>
    (itemEmEdicao?.adicionais ?? [])
      .map((a) => a.id)
      .filter((idAdicional) => produto.adicionais.some((a) => a.id === idAdicional)),
  )
  const [quantidade, setQuantidade] = useState(itemEmEdicao?.quantidade ?? 1)
  const [observacao, setObservacao] = useState(itemEmEdicao?.observacao ?? '')

  const tamanho = produto.tamanhos.find((t) => t.id === tamanhoId)
  const adicionais = produto.adicionais.filter((a) => adicionaisMarcados.includes(a.id))
  const total = tamanho
    ? precoUnitarioEmCentavos({ precoTamanho: tamanho.preco, adicionais }) * quantidade
    : 0

  function alternarAdicional(adicionalId: number) {
    setAdicionaisMarcados((marcados) =>
      marcados.includes(adicionalId)
        ? marcados.filter((m) => m !== adicionalId)
        : [...marcados, adicionalId],
    )
  }

  function confirmar() {
    if (!tamanho) return
    const item = {
      produtoId: produto.id,
      produtoNome: produto.nome,
      imagem: produto.imagem,
      tamanhoId: tamanho.id,
      tamanhoNome: tamanho.nome,
      precoTamanho: tamanho.preco,
      adicionais: adicionais.map(({ id, nome, preco }) => ({ id, nome, preco })),
      quantidade,
      observacao,
    }
    if (itemEmEdicao) substituir(itemEmEdicao.chave, item)
    else adicionar(item)
    navigate('/carrinho')
  }

  return (
    <form
      className="pb-28"
      onSubmit={(evento) => {
        evento.preventDefault()
        confirmar()
      }}
    >
      <div className="relative -mx-4">
        <ImagemProduto
          imagem={produto.imagem}
          nome={produto.nome}
          id={produto.id}
          className="h-60 w-full [&>svg]:w-44 [&>svg]:translate-y-6"
        />
        <BotaoVoltar
          para={itemEmEdicao ? '/carrinho' : '/'}
          rotulo={itemEmEdicao ? 'Voltar ao pedido' : 'Voltar ao cardápio'}
          className="absolute top-4 left-4 ring-0"
        />
      </div>

      <h1 className="mt-6 text-[2rem] leading-tight font-extrabold">{produto.nome}</h1>
      <p className="mt-1.5 text-texto-suave">{produto.descricao}</p>

      <fieldset className="mt-7">
        <legend className="mb-3">
          <span className="titulo-secao">Tamanho</span>
          <span className="text-sm text-texto-suave"> · obrigatório</span>
        </legend>
        <div className="grid grid-cols-3 gap-2.5">
          {produto.tamanhos.map((t) => (
            <label
              key={t.id}
              className="cursor-pointer rounded-2xl bg-white px-2 py-4 text-center ring-1 ring-acai-200 transition hover:ring-acai-300 has-checked:bg-acai-100 has-checked:ring-2 has-checked:ring-acai-800 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-acai-500"
            >
              <input
                type="radio"
                name="tamanho"
                value={t.id}
                checked={t.id === tamanhoId}
                onChange={() => setTamanhoId(t.id)}
                className="sr-only"
              />
              <span className="block text-lg font-bold">{t.nome}</span>
              <span className="mt-0.5 block text-sm font-bold text-acai-800">{formatarPreco(t.preco)}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {produto.adicionais.length > 0 && (
        <fieldset className="mt-7">
          <legend className="mb-3">
            <span className="titulo-secao">Adicionais</span>
            <span className="text-sm text-texto-suave">
              {' '}
              ·{' '}
              {adicionaisMarcados.length === 0
                ? 'opcional'
                : `${adicionaisMarcados.length} ${adicionaisMarcados.length === 1 ? 'escolhido' : 'escolhidos'}`}
            </span>
          </legend>
          <div className="divide-y divide-acai-100 overflow-hidden rounded-3xl bg-white ring-1 ring-acai-100">
            {produto.adicionais.map((a) => (
              <label
                key={a.id}
                className="flex cursor-pointer items-center gap-3.5 px-4 py-4 transition hover:bg-acai-50 has-focus-visible:bg-acai-50"
              >
                <span className="relative flex h-6 w-6 shrink-0">
                  <input
                    type="checkbox"
                    checked={adicionaisMarcados.includes(a.id)}
                    onChange={() => alternarAdicional(a.id)}
                    className="peer h-6 w-6 cursor-pointer appearance-none rounded-md border-2 border-acai-950/70 bg-white transition checked:border-acai-800 checked:bg-acai-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acai-500"
                  />
                  <Icone
                    nome="check"
                    className="pointer-events-none absolute inset-0.5 h-5 w-5 text-white opacity-0 peer-checked:opacity-100"
                  />
                </span>
                <span className="flex-1">{a.nome}</span>
                <span className="text-sm text-texto-suave">+ {formatarPreco(a.preco)}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className="mt-7">
        <label htmlFor="observacao" className="mb-3 block">
          <span className="titulo-secao">Observação</span>
          <span className="text-sm text-texto-suave"> · opcional</span>
        </label>
        <textarea
          id="observacao"
          value={observacao}
          onChange={(e) => setObservacao(e.target.value)}
          maxLength={200}
          rows={2}
          placeholder="Ex.: pouca granola, sem gelo..."
          className="w-full rounded-2xl bg-white p-4 ring-1 ring-acai-200 placeholder:text-acai-400 focus:outline-2 focus:outline-acai-500"
        />
      </div>

      <BarraInferior>
        <Quantidade
          valor={quantidade}
          maximo={QUANTIDADE_MAXIMA}
          onChange={setQuantidade}
          rotulo="Quantidade"
        />
        <button type="submit" disabled={!tamanho} className={botaoPrincipal}>
          <span>{itemEmEdicao ? 'Atualizar' : 'Adicionar'}</span>
          <span className="text-lima-400">{formatarCentavos(total)}</span>
        </button>
      </BarraInferior>
    </form>
  )
}
