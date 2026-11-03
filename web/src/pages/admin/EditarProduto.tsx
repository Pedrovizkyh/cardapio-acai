import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import {
  useAtualizarProduto,
  useAtualizarTamanho,
  useCategoriasAdmin,
  useCriarProduto,
  useCriarTamanho,
  useProdutoAdmin,
  useRemoverProduto,
  useRemoverTamanho,
} from '../../api/cardapioAdmin.ts'
import type { ProdutoAdmin, Tamanho } from '../../api/tipos.ts'
import { estilos } from '../../admin/estilos.ts'
import { Alerta, BotaoRemover } from '../../admin/ui.tsx'
import { precoDigitado, precoParaCampo } from '../../lib/preco.ts'

export default function EditarProduto() {
  const parametro = useParams().id
  const id = parametro === 'novo' ? null : Number(parametro)
  const produto = useProdutoAdmin(id)

  return (
    <div className="mt-4">
      <Link to="/admin/cardapio" className="text-sm font-semibold text-acai-700">
        ← Produtos
      </Link>
      {id === null ? (
        <FormularioProduto />
      ) : produto.isPending ? (
        <p className="mt-4">Carregando...</p>
      ) : produto.isError ? (
        <Alerta erro={produto.error} />
      ) : (
        <>
          <FormularioProduto key={produto.data.id} produto={produto.data} />
          <Tamanhos produto={produto.data} />
          <RemoverProduto id={produto.data.id} />
        </>
      )}
    </div>
  )
}

type TamanhoRascunho = { nome: string; preco: string }

function FormularioProduto({ produto }: { produto?: ProdutoAdmin }) {
  const navigate = useNavigate()
  const categorias = useCategoriasAdmin()
  const criar = useCriarProduto()
  const atualizar = useAtualizarProduto()

  const [nome, setNome] = useState(produto?.nome ?? '')
  const [descricao, setDescricao] = useState(produto?.descricao ?? '')
  const [categoriaId, setCategoriaId] = useState(produto?.categoriaId ?? 0)
  const [imagem, setImagem] = useState(produto?.imagem ?? '')
  const [tamanhos, setTamanhos] = useState<TamanhoRascunho[]>([{ nome: '', preco: '' }])
  const [aviso, setAviso] = useState('')
  const [salvo, setSalvo] = useState(false)

  const mutacao = produto ? atualizar : criar

  function enviar(evento: FormEvent) {
    evento.preventDefault()
    setSalvo(false)
    if (!nome.trim() || !categoriaId) {
      setAviso('Preencha o nome e escolha a categoria.')
      return
    }
    const dados = {
      nome: nome.trim(),
      descricao: descricao.trim(),
      categoriaId,
      imagem: imagem.trim() || undefined,
    }

    if (produto) {
      setAviso('')
      atualizar.mutate({ id: produto.id, ...dados }, { onSuccess: () => setSalvo(true) })
      return
    }

    const convertidos = tamanhos.map((t) => ({ nome: t.nome.trim(), preco: precoDigitado(t.preco) }))
    if (convertidos.some((t) => !t.nome || t.preco === null)) {
      setAviso('Cada tamanho precisa de nome e preço (ex.: 19,90).')
      return
    }
    setAviso('')
    criar.mutate(
      { ...dados, tamanhos: convertidos.map((t) => ({ nome: t.nome, preco: t.preco! })) },
      { onSuccess: (novo) => navigate(`/admin/cardapio/produtos/${novo.id}`, { replace: true }) },
    )
  }

  return (
    <form onSubmit={enviar} className={`${estilos.cartao} mt-3 space-y-3`}>
      <h1 className="text-xl font-extrabold">{produto ? 'Editar produto' : 'Novo produto'}</h1>

      <label className="block">
        <span className="text-sm font-bold">Nome</span>
        <input value={nome} onChange={(e) => setNome(e.target.value)} maxLength={80} className={estilos.campo} />
      </label>

      <label className="block">
        <span className="text-sm font-bold">Descrição</span>
        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          maxLength={300}
          rows={2}
          className={estilos.campo}
        />
      </label>

      <label className="block">
        <span className="text-sm font-bold">Categoria</span>
        <select
          value={categoriaId}
          onChange={(e) => setCategoriaId(Number(e.target.value))}
          className={estilos.campo}
        >
          <option value={0} disabled>
            Escolha...
          </option>
          {categorias.data?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="text-sm font-bold">
          Link da imagem <span className="font-normal text-acai-600">(opcional)</span>
        </span>
        <input
          type="url"
          value={imagem}
          onChange={(e) => setImagem(e.target.value)}
          placeholder="https://..."
          className={estilos.campo}
        />
      </label>

      {!produto && (
        <fieldset className="space-y-2">
          <legend className="text-sm font-bold">Tamanhos</legend>
          {tamanhos.map((t, i) => (
            <div key={i} className="flex gap-2">
              <input
                aria-label={`Nome do tamanho ${i + 1}`}
                placeholder="300 ml"
                value={t.nome}
                onChange={(e) =>
                  setTamanhos((lista) => lista.map((x, j) => (j === i ? { ...x, nome: e.target.value } : x)))
                }
                className={estilos.campo}
              />
              <input
                aria-label={`Preço do tamanho ${i + 1}`}
                placeholder="14,90"
                inputMode="decimal"
                value={t.preco}
                onChange={(e) =>
                  setTamanhos((lista) => lista.map((x, j) => (j === i ? { ...x, preco: e.target.value } : x)))
                }
                className={`${estilos.campo} max-w-28`}
              />
              {tamanhos.length > 1 && (
                <button
                  type="button"
                  aria-label={`Tirar tamanho ${i + 1}`}
                  onClick={() => setTamanhos((lista) => lista.filter((_, j) => j !== i))}
                  className="px-2 text-red-700"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => setTamanhos((lista) => [...lista, { nome: '', preco: '' }])}
            className={estilos.botaoLeve}
          >
            + Tamanho
          </button>
        </fieldset>
      )}

      {aviso && <p className="text-sm font-semibold text-red-800">{aviso}</p>}
      <Alerta erro={mutacao.error} />
      {salvo && <p className="text-sm font-semibold text-emerald-700">Salvo!</p>}

      <button type="submit" disabled={mutacao.isPending} className={estilos.botao}>
        {mutacao.isPending ? 'Salvando...' : produto ? 'Salvar' : 'Criar produto'}
      </button>
    </form>
  )
}

function Tamanhos({ produto }: { produto: ProdutoAdmin }) {
  const criar = useCriarTamanho()
  const [nome, setNome] = useState('')
  const [preco, setPreco] = useState('')
  const [aviso, setAviso] = useState('')

  function adicionar(evento: FormEvent) {
    evento.preventDefault()
    const valor = precoDigitado(preco)
    if (!nome.trim() || valor === null) {
      setAviso('Informe nome e preço (ex.: 19,90).')
      return
    }
    setAviso('')
    criar.mutate(
      { produtoId: produto.id, nome: nome.trim(), preco: valor },
      {
        onSuccess: () => {
          setNome('')
          setPreco('')
        },
      },
    )
  }

  return (
    <section className={`${estilos.cartao} mt-4`}>
      <h2 className="text-lg font-extrabold">Tamanhos</h2>
      <ul className="mt-2 space-y-2">
        {produto.tamanhos.map((t) => (
          <LinhaTamanho key={t.id} tamanho={t} ultimo={produto.tamanhos.length === 1} />
        ))}
      </ul>

      <form onSubmit={adicionar} className="mt-4 flex flex-wrap gap-2 border-t border-acai-100 pt-4">
        <input
          aria-label="Nome do novo tamanho"
          placeholder="Novo tamanho (ex.: 1 litro)"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className={`${estilos.campo} flex-1`}
        />
        <input
          aria-label="Preço do novo tamanho"
          placeholder="29,90"
          inputMode="decimal"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
          className={`${estilos.campo} max-w-28`}
        />
        <button type="submit" disabled={criar.isPending} className={estilos.botao}>
          Adicionar
        </button>
      </form>
      {aviso && <p className="mt-2 text-sm font-semibold text-red-800">{aviso}</p>}
      <Alerta erro={criar.error} />
    </section>
  )
}

function LinhaTamanho({ tamanho, ultimo }: { tamanho: Tamanho; ultimo: boolean }) {
  const atualizar = useAtualizarTamanho()
  const remover = useRemoverTamanho()
  const [nome, setNome] = useState(tamanho.nome)
  const [preco, setPreco] = useState(precoParaCampo(tamanho.preco))
  const [aviso, setAviso] = useState('')

  const mudou = nome !== tamanho.nome || preco !== precoParaCampo(tamanho.preco)

  function salvar() {
    const valor = precoDigitado(preco)
    if (!nome.trim() || valor === null) {
      setAviso('Informe nome e preço (ex.: 19,90).')
      return
    }
    setAviso('')
    atualizar.mutate({ id: tamanho.id, nome: nome.trim(), preco: valor })
  }

  return (
    <li>
      <div className="flex flex-wrap items-center gap-2">
        <input
          aria-label="Nome do tamanho"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className={`${estilos.campo} flex-1`}
        />
        <input
          aria-label="Preço do tamanho"
          inputMode="decimal"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
          className={`${estilos.campo} max-w-28`}
        />
        <button type="button" onClick={salvar} disabled={!mudou || atualizar.isPending} className={estilos.botao}>
          Salvar
        </button>
        {!ultimo && (
          <BotaoRemover onConfirmar={() => remover.mutate(tamanho.id)} desabilitado={remover.isPending}>
            Remover
          </BotaoRemover>
        )}
      </div>
      {aviso && <p className="mt-1 text-sm font-semibold text-red-800">{aviso}</p>}
      <Alerta erro={atualizar.error ?? remover.error} />
    </li>
  )
}

function RemoverProduto({ id }: { id: number }) {
  const navigate = useNavigate()
  const remover = useRemoverProduto()

  return (
    <section className="mt-6 text-right">
      <BotaoRemover
        confirmacao="Apagar de vez?"
        desabilitado={remover.isPending}
        onConfirmar={() =>
          remover.mutate(id, { onSuccess: () => navigate('/admin/cardapio', { replace: true }) })
        }
      >
        Apagar produto
      </BotaoRemover>
      <Alerta erro={remover.error} />
    </section>
  )
}
