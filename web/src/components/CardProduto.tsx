import { Link } from 'react-router'
import type { Produto } from '../api/tipos.ts'
import { formatarCentavos, menorPreco } from '../lib/preco.ts'
import ImagemProduto from './ImagemProduto.tsx'

export default function CardProduto({ produto }: { produto: Produto }) {
  const aPartirDe = menorPreco(produto.tamanhos.map((t) => t.preco))
  const esgotado = !produto.ativo

  const conteudo = (
    <>
      <ImagemProduto
        imagem={produto.imagem}
        nome={produto.nome}
        id={produto.id}
        esgotado={esgotado}
        className="h-24 w-24 shrink-0 rounded-2xl"
      />
      <div className="flex min-w-0 flex-1 flex-col py-0.5">
        <h3 className={`text-lg leading-snug font-bold ${esgotado ? 'text-texto-suave' : ''}`}>
          {produto.nome}
        </h3>
        <p className="mt-0.5 line-clamp-2 text-sm text-texto-suave">{produto.descricao}</p>
        {esgotado ? (
          <p className="mt-auto pt-2">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-texto-suave ring-1 ring-acai-200">
              Esgotado hoje
            </span>
          </p>
        ) : (
          aPartirDe !== null && (
            <p className="mt-auto pt-1.5 text-sm font-bold text-acai-800">
              a partir de {formatarCentavos(aPartirDe)}
            </p>
          )
        )}
      </div>
    </>
  )

  if (esgotado) {
    return (
      <div
        aria-disabled="true"
        className="flex gap-4 rounded-3xl border-2 border-dashed border-acai-200 bg-acai-100/60 p-3"
      >
        {conteudo}
      </div>
    )
  }

  return (
    <Link
      to={`/produto/${produto.id}`}
      className="flex gap-4 rounded-3xl bg-white p-3 ring-1 ring-acai-100 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-acai-800/5 hover:ring-acai-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acai-500 motion-reduce:hover:translate-y-0"
    >
      {conteudo}
    </Link>
  )
}
