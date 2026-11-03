import { Link } from 'react-router'
import { useAtualizarProduto, useProdutosAdmin } from '../../api/cardapioAdmin.ts'
import { mensagemDeErro } from '../../api/cliente.ts'
import type { ProdutoAdmin } from '../../api/tipos.ts'
import { estilos } from '../../admin/estilos.ts'
import { Alerta } from '../../admin/ui.tsx'
import { MensagemErro } from '../../components/Estados.tsx'
import { formatarCentavos, menorPreco } from '../../lib/preco.ts'

export default function ProdutosAdmin() {
  const { data, isPending, isError, error, refetch } = useProdutosAdmin()

  if (isPending) return <p className="mt-4 text-acai-700">Carregando produtos...</p>
  if (isError) {
    return <MensagemErro mensagem={mensagemDeErro(error)} onTentarDeNovo={() => void refetch()} />
  }

  const porCategoria = new Map<string, ProdutoAdmin[]>()
  for (const produto of data) {
    const nome = produto.categoria.nome
    porCategoria.set(nome, [...(porCategoria.get(nome) ?? []), produto])
  }

  return (
    <div className="mt-4">
      <Link to="/admin/cardapio/produtos/novo" className={`${estilos.botao} inline-block`}>
        + Novo produto
      </Link>

      {[...porCategoria].map(([categoria, produtos]) => (
        <section key={categoria} className="mt-6">
          <h2 className="mb-2 text-lg font-extrabold">{categoria}</h2>
          <ul className="space-y-2">
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
    <li className={`${estilos.cartao} ${produto.ativo ? '' : 'opacity-75'}`}>
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-bold">
            {produto.nome}
            {!produto.ativo && (
              <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-800">
                Esgotado
              </span>
            )}
          </p>
          <p className="text-sm text-acai-700">
            {produto.tamanhos.length} {produto.tamanhos.length === 1 ? 'tamanho' : 'tamanhos'}
            {aPartirDe !== null && ` · a partir de ${formatarCentavos(aPartirDe)}`}
          </p>
        </div>
        <button
          type="button"
          disabled={atualizar.isPending}
          onClick={() => atualizar.mutate({ id: produto.id, ativo: !produto.ativo })}
          className={produto.ativo ? estilos.botaoLeve : estilos.botao}
        >
          {produto.ativo ? 'Marcar esgotado' : 'Voltar ao cardápio'}
        </button>
        <Link to={`/admin/cardapio/produtos/${produto.id}`} className="text-sm font-semibold underline">
          Editar
        </Link>
      </div>
      <Alerta erro={atualizar.error} />
    </li>
  )
}
