import { useSearchParams } from 'react-router'
import AdicionaisAdmin from './AdicionaisAdmin.tsx'
import CategoriasAdmin from './CategoriasAdmin.tsx'
import ProdutosAdmin from './ProdutosAdmin.tsx'

const abas = [
  { id: 'produtos', rotulo: 'Produtos' },
  { id: 'adicionais', rotulo: 'Adicionais' },
  { id: 'categorias', rotulo: 'Categorias' },
] as const

type Aba = (typeof abas)[number]['id']

export default function CardapioAdmin() {
  const [parametros, setParametros] = useSearchParams()
  const aba = (parametros.get('aba') as Aba | null) ?? 'produtos'

  return (
    <section>
      <nav aria-label="Seções do cardápio" className="mt-3 flex gap-2">
        {abas.map((a) => (
          <button
            key={a.id}
            type="button"
            aria-pressed={aba === a.id}
            onClick={() => setParametros({ aba: a.id })}
            className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-acai-800 ring-1 ring-acai-200 aria-pressed:bg-acai-700 aria-pressed:text-white"
          >
            {a.rotulo}
          </button>
        ))}
      </nav>
      {aba === 'produtos' && <ProdutosAdmin />}
      {aba === 'adicionais' && <AdicionaisAdmin />}
      {aba === 'categorias' && <CategoriasAdmin />}
    </section>
  )
}
