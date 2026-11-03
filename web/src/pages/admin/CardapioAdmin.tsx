import { useSearchParams } from 'react-router'
import { estilos } from '../../admin/estilos.ts'
import CategoriasAdmin from './CategoriasAdmin.tsx'
import ProdutosAdmin from './ProdutosAdmin.tsx'

const abas = [
  { id: 'produtos', rotulo: 'Produtos' },
  { id: 'categorias', rotulo: 'Categorias' },
] as const

type Aba = (typeof abas)[number]['id']

export default function CardapioAdmin() {
  const [parametros, setParametros] = useSearchParams()
  const aba: Aba = parametros.get('aba') === 'categorias' ? 'categorias' : 'produtos'

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className={estilos.titulo}>Cardápio</h1>
          <p className={estilos.subtitulo}>Produtos esgotados aparecem desabilitados para o cliente.</p>
        </div>
        <nav aria-label="Seções do cardápio" className="flex gap-1 rounded-2xl bg-acai-100 p-1.5">
          {abas.map((a) => (
            <button
              key={a.id}
              type="button"
              aria-pressed={aba === a.id}
              onClick={() => setParametros({ aba: a.id })}
              className="h-10 rounded-xl px-4 text-sm font-bold text-acai-950/70 transition aria-pressed:bg-white aria-pressed:text-acai-950 aria-pressed:shadow-sm"
            >
              {a.rotulo}
            </button>
          ))}
        </nav>
      </div>
      {aba === 'produtos' ? <ProdutosAdmin /> : <CategoriasAdmin />}
    </section>
  )
}
