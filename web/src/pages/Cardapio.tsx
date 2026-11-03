import { useCardapio } from '../api/cardapio.ts'
import { mensagemDeErro } from '../api/cliente.ts'
import CardProduto from '../components/CardProduto.tsx'
import { EsqueletoLista, MensagemErro } from '../components/Estados.tsx'
import { emojiDaCategoria } from '../lib/categoria.ts'

export default function Cardapio() {
  const { data, isPending, isError, error, refetch } = useCardapio()

  if (isPending) return <EsqueletoLista />
  if (isError) {
    return (
      <MensagemErro
        mensagem={`Não conseguimos carregar o cardápio. ${mensagemDeErro(error)}`}
        onTentarDeNovo={() => void refetch()}
      />
    )
  }

  const categorias = data.filter((c) => c.produtos.length > 0)
  if (categorias.length === 0) {
    return <MensagemErro mensagem="O cardápio está vazio no momento." />
  }

  return (
    <>
      <nav
        aria-label="Categorias"
        className="sticky top-[60px] z-[5] -mx-4 flex gap-2 overflow-x-auto bg-acai-50/95 px-4 py-3 backdrop-blur"
      >
        {categorias.map((categoria) => (
          <a
            key={categoria.id}
            href={`#categoria-${categoria.id}`}
            className="shrink-0 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-acai-800 ring-1 ring-acai-200 hover:bg-acai-100"
          >
            {emojiDaCategoria(categoria.nome)} {categoria.nome}
          </a>
        ))}
      </nav>

      {categorias.map((categoria) => {
        const emoji = emojiDaCategoria(categoria.nome)
        return (
          <section
            key={categoria.id}
            id={`categoria-${categoria.id}`}
            className="mt-4 scroll-mt-32"
          >
            <h2 className="mb-3 text-xl font-extrabold text-acai-800">
              {categoria.nome}
            </h2>
            <div className="space-y-3">
              {categoria.produtos.map((produto) => (
                <CardProduto key={produto.id} produto={produto} emoji={emoji} />
              ))}
            </div>
          </section>
        )
      })}
    </>
  )
}
