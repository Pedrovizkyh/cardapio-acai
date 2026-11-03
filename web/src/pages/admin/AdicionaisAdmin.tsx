import { useState, type FormEvent } from 'react'
import {
  useAdicionaisAdmin,
  useAtualizarAdicional,
  useCriarAdicional,
  useRemoverAdicional,
} from '../../api/cardapioAdmin.ts'
import { mensagemDeErro } from '../../api/cliente.ts'
import type { Adicional } from '../../api/tipos.ts'
import { estilos } from '../../admin/estilos.ts'
import { Alerta, BotaoRemover } from '../../admin/ui.tsx'
import { MensagemErro } from '../../components/Estados.tsx'
import { precoDigitado, precoParaCampo } from '../../lib/preco.ts'

export default function AdicionaisAdmin() {
  const { data, isPending, isError, error, refetch } = useAdicionaisAdmin()

  return (
    <section>
      <h1 className={estilos.titulo}>Adicionais</h1>
      <p className={estilos.subtitulo}>Valem para todas as categorias que aceitam adicionais.</p>
      {isPending ? (
        <p className="mt-6 text-texto-suave">Carregando adicionais...</p>
      ) : isError ? (
        <MensagemErro mensagem={mensagemDeErro(error)} onTentarDeNovo={() => void refetch()} />
      ) : (
        <div className="mt-6 max-w-3xl space-y-3">
          <NovoAdicional />
          <ul className="space-y-2">
            {data.map((adicional) => (
              <LinhaAdicional key={adicional.id} adicional={adicional} />
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}

function NovoAdicional() {
  const criar = useCriarAdicional()
  const [nome, setNome] = useState('')
  const [preco, setPreco] = useState('')
  const [aviso, setAviso] = useState('')

  function enviar(evento: FormEvent) {
    evento.preventDefault()
    const valor = precoDigitado(preco)
    if (!nome.trim() || valor === null) {
      setAviso('Informe nome e preço (ex.: 2,50).')
      return
    }
    setAviso('')
    criar.mutate(
      { nome: nome.trim(), preco: valor },
      {
        onSuccess: () => {
          setNome('')
          setPreco('')
        },
      },
    )
  }

  return (
    <form onSubmit={enviar} className={estilos.cartao}>
      <h2 className="titulo-secao">Novo adicional</h2>
      <div className="mt-2 flex flex-wrap gap-2">
        <input
          aria-label="Nome do adicional"
          placeholder="Ex.: Kiwi"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          maxLength={60}
          className={`${estilos.campo} flex-1`}
        />
        <input
          aria-label="Preço do adicional"
          placeholder="3,00"
          inputMode="decimal"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
          className={`${estilos.campo} max-w-28`}
        />
        <button type="submit" disabled={criar.isPending} className={estilos.botao}>
          Adicionar
        </button>
      </div>
      {aviso && <p className="mt-2 text-sm font-semibold text-perigo">{aviso}</p>}
      <Alerta erro={criar.error} />
    </form>
  )
}

function LinhaAdicional({ adicional }: { adicional: Adicional }) {
  const atualizar = useAtualizarAdicional()
  const remover = useRemoverAdicional()
  const [nome, setNome] = useState(adicional.nome)
  const [preco, setPreco] = useState(precoParaCampo(adicional.preco))
  const [aviso, setAviso] = useState('')

  const mudou = nome !== adicional.nome || preco !== precoParaCampo(adicional.preco)

  function salvar() {
    const valor = precoDigitado(preco)
    if (!nome.trim() || valor === null) {
      setAviso('Informe nome e preço (ex.: 2,50).')
      return
    }
    setAviso('')
    atualizar.mutate({ id: adicional.id, nome: nome.trim(), preco: valor })
  }

  return (
    <li className={adicional.ativo ? estilos.cartao : 'rounded-2xl border-2 border-dashed border-acai-200 bg-acai-100/60 p-4'}>
      <div className="flex flex-wrap items-center gap-2">
        <input
          aria-label="Nome do adicional"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className={`${estilos.campo} min-w-32 flex-1`}
        />
        <input
          aria-label="Preço do adicional"
          inputMode="decimal"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
          className={`${estilos.campo} max-w-24`}
        />
        <button type="button" onClick={salvar} disabled={!mudou || atualizar.isPending} className={estilos.botao}>
          Salvar
        </button>
        <button
          type="button"
          disabled={atualizar.isPending}
          onClick={() => atualizar.mutate({ id: adicional.id, ativo: !adicional.ativo })}
          className={estilos.botaoLeve}
        >
          {adicional.ativo ? 'Desativar' : 'Ativar'}
        </button>
        <BotaoRemover onConfirmar={() => remover.mutate(adicional.id)} desabilitado={remover.isPending}>
          Remover
        </BotaoRemover>
      </div>
      {!adicional.ativo && <p className="mt-2 text-xs font-bold text-texto-suave">Fora do cardápio</p>}
      {aviso && <p className="mt-1 text-sm font-semibold text-perigo">{aviso}</p>}
      <Alerta erro={atualizar.error ?? remover.error} />
    </li>
  )
}
