import { Link } from 'react-router'
import {
  precoUnitarioEmCentavos,
  QUANTIDADE_MAXIMA,
  subtotalEmCentavos,
  totalEmCentavos,
  useCarrinho,
} from '../carrinho/carrinho.ts'
import Quantidade from '../components/Quantidade.tsx'
import { formatarCentavos } from '../lib/preco.ts'

export default function Carrinho() {
  const { itens, alterarQuantidade, remover } = useCarrinho()

  if (itens.length === 0) {
    return (
      <section className="mt-10 text-center">
        <p className="text-5xl" aria-hidden>
          🛒
        </p>
        <h1 className="mt-3 text-xl font-extrabold">Seu carrinho está vazio</h1>
        <p className="mt-1 text-acai-700">Que tal um açaí geladinho?</p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-full bg-acai-700 px-6 py-3 font-bold text-white hover:bg-acai-800"
        >
          Ver cardápio
        </Link>
      </section>
    )
  }

  return (
    <section className="pb-28">
      <h1 className="mt-4 text-2xl font-extrabold">Seu carrinho</h1>

      <ul className="mt-4 space-y-3">
        {itens.map((item) => (
          <li key={item.chave} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-acai-100">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-bold">
                  <span aria-hidden>{item.emoji} </span>
                  {item.produtoNome} <span className="font-normal text-acai-600">· {item.tamanhoNome}</span>
                </p>
                {item.adicionais.length > 0 && (
                  <p className="mt-0.5 text-sm text-acai-700">
                    + {item.adicionais.map((a) => a.nome).join(', ')}
                  </p>
                )}
                {item.observacao && (
                  <p className="mt-0.5 text-sm italic text-acai-600">“{item.observacao}”</p>
                )}
                <p className="mt-1 text-xs text-acai-600">
                  {formatarCentavos(precoUnitarioEmCentavos(item))} cada
                </p>
              </div>
              <button
                type="button"
                onClick={() => remover(item.chave)}
                className="shrink-0 rounded-full px-2 py-1 text-sm font-semibold text-red-700 hover:bg-red-50"
                aria-label={`Remover ${item.produtoNome}`}
              >
                Remover
              </button>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <Quantidade
                valor={item.quantidade}
                maximo={QUANTIDADE_MAXIMA}
                onChange={(q) => alterarQuantidade(item.chave, q)}
                rotulo={`Quantidade de ${item.produtoNome}`}
              />
              <span className="font-extrabold text-acai-800">
                {formatarCentavos(subtotalEmCentavos(item))}
              </span>
            </div>
          </li>
        ))}
      </ul>

      <Link to="/" className="mt-4 inline-block font-semibold text-acai-700 underline">
        + Adicionar mais itens
      </Link>

      <div className="fixed inset-x-0 bottom-0 border-t border-acai-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center gap-4 px-4 py-3">
          <div>
            <p className="text-xs text-acai-600">Total</p>
            <p className="text-lg font-extrabold">{formatarCentavos(totalEmCentavos(itens))}</p>
          </div>
          <Link
            to="/checkout"
            className="flex-1 rounded-full bg-acai-700 px-5 py-3 text-center font-bold text-white shadow hover:bg-acai-800"
          >
            Finalizar pedido
          </Link>
        </div>
      </div>
    </section>
  )
}
