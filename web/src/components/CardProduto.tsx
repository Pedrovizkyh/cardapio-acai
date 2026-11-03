import { Link } from 'react-router'
import type { Produto } from '../api/tipos.ts'
import { formatarCentavos, menorPreco } from '../lib/preco.ts'
import ImagemProduto from './ImagemProduto.tsx'

type Props = { produto: Produto; emoji: string }

export default function CardProduto({ produto, emoji }: Props) {
  const aPartirDe = menorPreco(produto.tamanhos.map((t) => t.preco))

  return (
    <Link
      to={`/produto/${produto.id}`}
      className="flex gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-acai-100 transition hover:shadow-md hover:ring-acai-200 focus-visible:outline-2 focus-visible:outline-acai-500"
    >
      <ImagemProduto
        imagem={produto.imagem}
        nome={produto.nome}
        emoji={emoji}
        className="h-24 w-24 shrink-0 rounded-xl"
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="font-bold text-acai-900">{produto.nome}</h3>
        <p className="mt-0.5 line-clamp-2 text-sm text-acai-700">
          {produto.descricao}
        </p>
        {aPartirDe !== null && (
          <p className="mt-auto pt-1 text-sm">
            <span className="text-acai-600">a partir de </span>
            <span className="font-extrabold text-acai-800">
              {formatarCentavos(aPartirDe)}
            </span>
          </p>
        )}
      </div>
    </Link>
  )
}
