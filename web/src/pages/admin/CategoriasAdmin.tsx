import { useState, type FormEvent } from 'react'
import {
  useAtualizarCategoria,
  useCategoriasAdmin,
  useCriarCategoria,
  useRemoverCategoria,
} from '../../api/cardapioAdmin.ts'
import { mensagemDeErro } from '../../api/cliente.ts'
import type { CategoriaAdmin } from '../../api/tipos.ts'
import { estilos } from '../../admin/estilos.ts'
import { Alerta, BotaoRemover } from '../../admin/ui.tsx'
import { MensagemErro } from '../../components/Estados.tsx'

export default function CategoriasAdmin() {
  const { data, isPending, isError, error, refetch } = useCategoriasAdmin()

  if (isPending) return <p className="mt-4 text-acai-700">Carregando categorias...</p>
  if (isError) {
    return <MensagemErro mensagem={mensagemDeErro(error)} onTentarDeNovo={() => void refetch()} />
  }

  const proximaOrdem = data.reduce((maior, c) => Math.max(maior, c.ordem + 1), 0)

  return (
    <div className="mt-4 space-y-3">
      <NovaCategoria ordem={proximaOrdem} />
      <p className="text-sm text-acai-700">
        A ordem define a posição no cardápio (menor aparece primeiro).
      </p>
      <ul className="space-y-2">
        {data.map((categoria) => (
          <LinhaCategoria key={categoria.id} categoria={categoria} />
        ))}
      </ul>
    </div>
  )
}

function NovaCategoria({ ordem }: { ordem: number }) {
  const criar = useCriarCategoria()
  const [nome, setNome] = useState('')
  const [aceitaAdicionais, setAceitaAdicionais] = useState(false)

  function enviar(evento: FormEvent) {
    evento.preventDefault()
    if (!nome.trim()) return
    criar.mutate(
      { nome: nome.trim(), ordem, aceitaAdicionais },
      {
        onSuccess: () => {
          setNome('')
          setAceitaAdicionais(false)
        },
      },
    )
  }

  return (
    <form onSubmit={enviar} className={estilos.cartao}>
      <h2 className="font-bold">Nova categoria</h2>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <input
          aria-label="Nome da categoria"
          placeholder="Ex.: Sorvetes"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          maxLength={60}
          className={`${estilos.campo} flex-1`}
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={aceitaAdicionais}
            onChange={(e) => setAceitaAdicionais(e.target.checked)}
            className="h-5 w-5 accent-acai-700"
          />
          Aceita adicionais
        </label>
        <button type="submit" disabled={criar.isPending || !nome.trim()} className={estilos.botao}>
          Adicionar
        </button>
      </div>
      <Alerta erro={criar.error} />
    </form>
  )
}

function LinhaCategoria({ categoria }: { categoria: CategoriaAdmin }) {
  const atualizar = useAtualizarCategoria()
  const remover = useRemoverCategoria()
  const [nome, setNome] = useState(categoria.nome)
  const [ordem, setOrdem] = useState(String(categoria.ordem))

  const ordemValida = /^\d+$/.test(ordem)
  const mudou = nome !== categoria.nome || ordem !== String(categoria.ordem)

  return (
    <li className={estilos.cartao}>
      <div className="flex flex-wrap items-center gap-2">
        <input
          aria-label="Nome da categoria"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className={`${estilos.campo} min-w-32 flex-1`}
        />
        <input
          aria-label="Ordem"
          inputMode="numeric"
          value={ordem}
          onChange={(e) => setOrdem(e.target.value)}
          className={`${estilos.campo} max-w-16`}
        />
        <button
          type="button"
          disabled={!mudou || !ordemValida || !nome.trim() || atualizar.isPending}
          onClick={() => atualizar.mutate({ id: categoria.id, nome: nome.trim(), ordem: Number(ordem) })}
          className={estilos.botao}
        >
          Salvar
        </button>
        <BotaoRemover onConfirmar={() => remover.mutate(categoria.id)} desabilitado={remover.isPending}>
          Remover
        </BotaoRemover>
      </div>
      <div className="mt-2 flex items-center justify-between text-sm text-acai-700">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={categoria.aceitaAdicionais}
            disabled={atualizar.isPending}
            onChange={(e) => atualizar.mutate({ id: categoria.id, aceitaAdicionais: e.target.checked })}
            className="h-5 w-5 accent-acai-700"
          />
          Aceita adicionais
        </label>
        <span>
          {categoria._count.produtos} {categoria._count.produtos === 1 ? 'produto' : 'produtos'}
        </span>
      </div>
      <Alerta erro={atualizar.error ?? remover.error} />
    </li>
  )
}
