import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { useCardapio, useProduto } from '../api/cardapio.ts'
import { mensagemDeErro } from '../api/cliente.ts'
import type { ProdutoDetalhe } from '../api/tipos.ts'
import { precoUnitarioEmCentavos, QUANTIDADE_MAXIMA, useCarrinho } from '../carrinho/carrinho.ts'
import { MensagemErro } from '../components/Estados.tsx'
import ImagemProduto from '../components/ImagemProduto.tsx'
import Quantidade from '../components/Quantidade.tsx'
import { emojiDaCategoria } from '../lib/categoria.ts'
import { formatarCentavos, formatarPreco } from '../lib/preco.ts'

export default function Montagem() {
  const id = Number(useParams().id)
  const { data: produto, isPending, isError, error, refetch } = useProduto(id)
  const { data: cardapio } = useCardapio()

  if (isPending) {
    return <div aria-busy="true" className="mt-6 h-64 animate-pulse rounded-2xl bg-acai-100" />
  }
  if (isError) {
    return (
      <>
        <MensagemErro
          mensagem={`Este produto não está disponível. ${mensagemDeErro(error)}`}
          onTentarDeNovo={() => void refetch()}
        />
        <VoltarAoCardapio />
      </>
    )
  }

  const categoria = cardapio?.find((c) => c.id === produto.categoriaId)
  const emoji = emojiDaCategoria(categoria?.nome ?? '')

  return <FormularioMontagem key={produto.id} produto={produto} emoji={emoji} />
}

function VoltarAoCardapio() {
  return (
    <Link to="/" className="mt-4 inline-block font-semibold text-acai-700 underline">
      ← Voltar ao cardápio
    </Link>
  )
}

function FormularioMontagem({ produto, emoji }: { produto: ProdutoDetalhe; emoji: string }) {
  const navigate = useNavigate()
  const adicionar = useCarrinho((estado) => estado.adicionar)

  const [tamanhoId, setTamanhoId] = useState(produto.tamanhos[0]?.id)
  const [adicionaisMarcados, setAdicionaisMarcados] = useState<number[]>([])
  const [quantidade, setQuantidade] = useState(1)
  const [observacao, setObservacao] = useState('')

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

  function adicionarAoCarrinho() {
    if (!tamanho) return
    adicionar({
      produtoId: produto.id,
      produtoNome: produto.nome,
      emoji,
      tamanhoId: tamanho.id,
      tamanhoNome: tamanho.nome,
      precoTamanho: tamanho.preco,
      adicionais: adicionais.map(({ id, nome, preco }) => ({ id, nome, preco })),
      quantidade,
      observacao,
    })
    navigate('/carrinho')
  }

  return (
    <form
      className="pb-28"
      onSubmit={(evento) => {
        evento.preventDefault()
        adicionarAoCarrinho()
      }}
    >
      <Link to="/" className="mt-4 inline-block text-sm font-semibold text-acai-700">
        ← Cardápio
      </Link>

      <ImagemProduto
        imagem={produto.imagem}
        nome={produto.nome}
        emoji={emoji}
        className="mt-3 h-44 w-full rounded-2xl [&>span]:text-7xl"
      />
      <h1 className="mt-4 text-2xl font-extrabold">{produto.nome}</h1>
      <p className="mt-1 text-acai-700">{produto.descricao}</p>

      <fieldset className="mt-6">
        <legend className="mb-2 font-bold">Tamanho</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {produto.tamanhos.map((t) => (
            <label
              key={t.id}
              className="cursor-pointer rounded-xl bg-white p-3 ring-1 ring-acai-200 has-checked:bg-acai-700 has-checked:text-white has-checked:ring-acai-700 has-focus-visible:outline-2 has-focus-visible:outline-acai-500"
            >
              <input
                type="radio"
                name="tamanho"
                value={t.id}
                checked={t.id === tamanhoId}
                onChange={() => setTamanhoId(t.id)}
                className="sr-only"
              />
              <span className="block font-bold">{t.nome}</span>
              <span className="block text-sm">{formatarPreco(t.preco)}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {produto.adicionais.length > 0 && (
        <fieldset className="mt-6">
          <legend className="mb-2 font-bold">
            Adicionais <span className="font-normal text-acai-600">(opcional)</span>
          </legend>
          <div className="divide-y divide-acai-100 rounded-xl bg-white ring-1 ring-acai-200">
            {produto.adicionais.map((a) => (
              <label key={a.id} className="flex cursor-pointer items-center gap-3 px-4 py-3">
                <input
                  type="checkbox"
                  checked={adicionaisMarcados.includes(a.id)}
                  onChange={() => alternarAdicional(a.id)}
                  className="h-5 w-5 accent-acai-700"
                />
                <span className="flex-1">{a.nome}</span>
                <span className="text-sm text-acai-700">+ {formatarPreco(a.preco)}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className="mt-6">
        <label htmlFor="observacao" className="mb-2 block font-bold">
          Observação <span className="font-normal text-acai-600">(opcional)</span>
        </label>
        <textarea
          id="observacao"
          value={observacao}
          onChange={(e) => setObservacao(e.target.value)}
          maxLength={200}
          rows={2}
          placeholder="Ex.: pouca granola, sem gelo..."
          className="w-full rounded-xl bg-white p-3 ring-1 ring-acai-200 focus:outline-2 focus:outline-acai-500"
        />
      </div>

      <div className="fixed inset-x-0 bottom-0 border-t border-acai-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center gap-4 px-4 py-3">
          <Quantidade
            valor={quantidade}
            maximo={QUANTIDADE_MAXIMA}
            onChange={setQuantidade}
            rotulo="Quantidade"
          />
          <button
            type="submit"
            disabled={!tamanho}
            className="flex-1 rounded-full bg-acai-700 px-5 py-3 font-bold text-white shadow hover:bg-acai-800 disabled:opacity-50"
          >
            Adicionar • {formatarCentavos(total)}
          </button>
        </div>
      </div>
    </form>
  )
}
