import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { useCardapio } from '../api/cardapio.ts'
import { mensagemDeErro } from '../api/cliente.ts'
import { contarItens, totalEmCentavos, useCarrinho } from '../carrinho/carrinho.ts'
import BarraInferior, { botaoPrincipal } from '../components/BarraInferior.tsx'
import Cabecalho from '../components/Cabecalho.tsx'
import CardProduto from '../components/CardProduto.tsx'
import { EsqueletoLista, MensagemErro } from '../components/Estados.tsx'
import { loja } from '../lib/loja.ts'
import { formatarCentavos } from '../lib/preco.ts'

export default function Cardapio() {
  const itens = useCarrinho((estado) => estado.itens)
  const quantidade = contarItens(itens)

  return (
    <div className={quantidade > 0 ? 'pb-28' : 'pb-8'}>
      <Cabecalho itensNoCarrinho={quantidade} />

      <section className="mt-5 overflow-hidden rounded-[28px] bg-acai-800 p-6 text-white">
        <h1 className="text-[2rem] leading-[1.05] font-extrabold">
          Monte o seu
          <br />
          do seu jeito.
        </h1>
        <ul className="mt-5 flex flex-wrap gap-2 text-sm font-bold">
          <li className="rounded-full bg-lima-400 px-3.5 py-1.5 text-acai-950">
            Entrega ~{loja.minutosEntrega} min
          </li>
          <li className="rounded-full bg-white/12 px-3.5 py-1.5 text-acai-100">
            Retirada ~{loja.minutosRetirada} min
          </li>
        </ul>
      </section>

      <ListaDoCardapio />

      <p className="mt-10 text-center text-xs text-texto-suave">{loja.nome} · marca fictícia para portfólio</p>

      {quantidade > 0 && (
        <BarraInferior>
          <Link to="/carrinho" className={botaoPrincipal}>
            <span>
              Ver carrinho · {quantidade} {quantidade === 1 ? 'item' : 'itens'}
            </span>
            <span className="text-lima-400">{formatarCentavos(totalEmCentavos(itens))}</span>
          </Link>
        </BarraInferior>
      )}
    </div>
  )
}

function ListaDoCardapio() {
  const { data, isPending, isError, error, refetch } = useCardapio()
  const categorias = data?.filter((c) => c.produtos.length > 0) ?? []
  const ativa = useCategoriaVisivel(categorias.map((c) => c.id))

  if (isPending) return <EsqueletoLista />
  if (isError) {
    return (
      <MensagemErro
        mensagem={`Não conseguimos carregar o cardápio. ${mensagemDeErro(error)}`}
        onTentarDeNovo={() => void refetch()}
      />
    )
  }
  if (categorias.length === 0) {
    return <MensagemErro mensagem="O cardápio está vazio no momento." />
  }

  return (
    <>
      <nav
        aria-label="Categorias"
        className="sticky top-0 z-10 -mx-4 mt-3 flex gap-2 overflow-x-auto bg-acai-50/90 px-4 py-3 backdrop-blur-md [scrollbar-width:none]"
      >
        {categorias.map((categoria) => {
          const atual = categoria.id === ativa
          return (
            <a
              key={categoria.id}
              href={`#categoria-${categoria.id}`}
              aria-current={atual ? 'true' : undefined}
              className={`shrink-0 rounded-2xl px-5 py-2.5 font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acai-500 ${
                atual ? 'bg-acai-950 text-white' : 'bg-white text-acai-950 ring-1 ring-acai-200 hover:bg-acai-100'
              }`}
            >
              {categoria.nome}
            </a>
          )
        })}
      </nav>

      {categorias.map((categoria, indice) => (
        <section
          key={categoria.id}
          id={`categoria-${categoria.id}`}
          data-categoria={categoria.id}
          className="scroll-mt-20"
        >
          <h2 className={`titulo-secao mb-3 ${indice === 0 ? 'mt-2' : 'mt-8'}`}>{categoria.nome}</h2>
          <div className="space-y-3">
            {categoria.produtos.map((produto) => (
              <CardProduto key={produto.id} produto={produto} />
            ))}
          </div>
        </section>
      ))}
    </>
  )
}

// Destaca na barra de categorias a seção que está passando na tela.
function useCategoriaVisivel(ids: number[]) {
  const [ativa, setAtiva] = useState<number | null>(null)
  const chave = ids.join(',')

  useEffect(() => {
    if (!chave) return
    const secoes = [...document.querySelectorAll<HTMLElement>('[data-categoria]')]
    const visiveis = new Set<number>()
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          const id = Number((entrada.target as HTMLElement).dataset.categoria)
          if (entrada.isIntersecting) visiveis.add(id)
          else visiveis.delete(id)
        }
        const primeira = secoes.find((s) => visiveis.has(Number(s.dataset.categoria)))
        if (primeira) setAtiva(Number(primeira.dataset.categoria))
      },
      { rootMargin: '-80px 0px -55% 0px' },
    )
    secoes.forEach((s) => observador.observe(s))
    return () => observador.disconnect()
  }, [chave])

  return ativa ?? ids[0] ?? null
}
