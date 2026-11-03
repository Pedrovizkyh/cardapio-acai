import { Link } from 'react-router'
import { loja, situacaoDaLoja } from '../lib/loja.ts'
import Icone from './Icone.tsx'
import Marca from './Marca.tsx'

type Props = { itensNoCarrinho: number }

export default function Cabecalho({ itensNoCarrinho }: Props) {
  const situacao = situacaoDaLoja()

  return (
    <header className="flex items-center justify-between gap-3 pt-5">
      <Link to="/" className="flex items-center gap-3 rounded-2xl focus-visible:outline-2 focus-visible:outline-acai-500">
        <Marca />
        <span className="leading-tight">
          <span className="block font-display text-xl font-bold">{loja.nome}</span>
          <span
            className={`flex items-center gap-1.5 text-sm font-semibold ${situacao.aberta ? 'text-emerald-700' : 'text-texto-suave'}`}
          >
            <span
              aria-hidden
              className={`h-2 w-2 rounded-full ${situacao.aberta ? 'bg-emerald-600' : 'bg-acai-300'}`}
            />
            {situacao.texto}
          </span>
        </span>
      </Link>

      <Link
        to="/carrinho"
        className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-acai-950 shadow-sm ring-1 ring-acai-100 transition hover:bg-acai-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acai-500"
        aria-label={`Seu pedido: ${itensNoCarrinho} ${itensNoCarrinho === 1 ? 'item' : 'itens'}`}
      >
        <Icone nome="sacola" className="h-6 w-6" />
        {itensNoCarrinho > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-6 min-w-6 items-center justify-center rounded-full bg-lima-400 px-1 text-xs font-bold text-acai-950 ring-2 ring-acai-50">
            {itensNoCarrinho}
          </span>
        )}
      </Link>
    </header>
  )
}
