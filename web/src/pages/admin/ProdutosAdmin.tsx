import { Link } from 'react-router'
import { useAtualizarProduto, useProdutosAdmin } from '../../api/cardapioAdmin.ts'
import { mensagemDeErro } from '../../api/cliente.ts'
import type { ProdutoAdmin } from '../../api/tipos.ts'
import { estilos } from '../../admin/estilos.ts'
import { Alerta } from '../../admin/ui.tsx'
import { MensagemErro } from '../../components/Estados.tsx'
import Icone from '../../components/Icone.tsx'
import ImagemProduto from '../../components/ImagemProduto.tsx'
import { formatarCentavos, menorPreco } from '../../lib/preco.ts'

export default function ProdutosAdmin() {
  const { data, isPending, isError, error, refetch } = useProdutosAdmin()

  if (isPending) return <p className="mt-6 text-texto-suave">Carregando produtos...</p>
  if (isError) {
    return <MensagemErro mensagem={mensagemDeErro(error)} onTentarDeNovo={() => void refetch()} />
  }

  const porCategoria = new Map<string, ProdutoAdmin[]>()
  for (const produto of data) {
    const nome = produto.categoria.nome
    porCategoria.set(nome, [...(porCategoria.get(nome) ?? []), produto])
  }

  return (
    <div className="mt-6">
      <Link to="/admin/cardapio/produtos/novo" className={`${estilos.botao} gap-1.5`}>
        <Icone nome="mais" className="h-4 w-4" /> Novo produto
      </Link>

      {[...porCategoria].map(([categoria, produtos]) => (
        <section key={categoria} className="mt-8">
          <h2 className="titulo-secao mb-3">{categoria}</h2>
          <ul className="grid gap-3 lg:grid-cols-2">
            {produtos.map((produto) => (
              <LinhaProduto key={produto.id} produto={produto} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

function LinhaProduto({ produto }: { produto: ProdutoAdmin }) {
  const atualizar = useAtualizarProduto()
  const aPartirDe = menorPreco(produto.tamanhos.map((t) => t.preco))

  return (
    <li
      className={`rounded-2xl p-3 ${produto.ativo ? 'bg-white ring-1 ring-acai-100' : 'border-2 border-dashed border-acai-200 bg-acai-100/60'}`}
    >
      <div className="flex flex-wrap items-center gap-3">
        <ImagemProduto
          imagem={produto.imagem}
          nome={produto.nome}
          id={produto.id}
          esgotado={!produto.ativo}
          className="h-16 w-16 shrink-0 rounded-xl"
        />
        <div className="min-w-0 flex-1">
          <p className="font-bold">
            {produto.nome}
            {!produto.ativo && (
              <span className="ml-2 rounded-full bg-white px-2 py-0.5 align-middle text-xs font-bold text-texto-suave ring-1 ring-acai-200">
                Esgotado
              </span>
            )}
          </p>
          <p className="text-sm text-texto-suave">
            {produto.tamanhos.length} {produto.tamanhos.length === 1 ? 'tamanho' : 'tamanhos'}
            {aPartirDe !== null && ` · a partir de ${formatarCentavos(aPartirDe)}`}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={atualizar.isPending}
            onClick={() => atualizar.mutate({ id: produto.id, ativo: !produto.ativo })}
            className={produto.ativo ? estilos.botaoLeve : estilos.botao}
          >
            {produto.ativo ? 'Marcar esgotado' : 'Voltar ao cardápio'}
          </button>
          <Link
            to={`/admin/cardapio/produtos/${produto.id}`}
            className={`${estilos.botaoLeve} w-11 px-0`}
            aria-label={`Editar ${produto.nome}`}
            title="Editar"
          >
            <Icone nome="lapis" className="h-4 w-4" />
          </Link>
        </div>
      </div>
      <Alerta erro={atualizar.error} />
    </li>
  )
}
