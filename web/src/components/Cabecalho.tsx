import { Link } from 'react-router'

type Props = { itensNoCarrinho: number }

export default function Cabecalho({ itensNoCarrinho }: Props) {
  return (
    <header className="sticky top-0 z-10 bg-acai-800 text-white shadow-md">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span aria-hidden className="text-2xl">
            🍇
          </span>
          <span className="leading-tight">
            <span className="block text-lg font-extrabold tracking-tight">
              Açaí da Orla
            </span>
            <span className="block text-xs text-acai-200">
              Açaí de verdade, pertinho do mar
            </span>
          </span>
        </Link>

        <Link
          to="/carrinho"
          className="relative flex items-center gap-2 rounded-full bg-lima-400 px-4 py-2 font-semibold text-acai-900 transition hover:bg-lima-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lima-300"
          aria-label={`Carrinho com ${itensNoCarrinho} ${itensNoCarrinho === 1 ? 'item' : 'itens'}`}
        >
          <span aria-hidden>🛒</span>
          <span>Carrinho</span>
          {itensNoCarrinho > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-acai-900 px-1 text-xs text-white">
              {itensNoCarrinho}
            </span>
          )}
        </Link>
      </div>
    </header>
  )
}
