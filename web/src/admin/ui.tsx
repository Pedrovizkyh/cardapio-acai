import { useState, type ReactNode } from 'react'
import { mensagemDeErro } from '../api/cliente.ts'
import { estilos } from './estilos.ts'

export function Alerta({ erro }: { erro: unknown }) {
  if (!erro) return null
  return (
    <p role="alert" className="mt-2 rounded-xl bg-red-50 p-3 text-sm font-semibold text-perigo">
      {mensagemDeErro(erro)}
    </p>
  )
}

type ConfirmarProps = {
  onConfirmar: () => void
  children: ReactNode
  confirmacao?: string
  desabilitado?: boolean
}

export function BotaoRemover({
  onConfirmar,
  children,
  confirmacao = 'Confirmar?',
  desabilitado,
}: ConfirmarProps) {
  const [confirmando, setConfirmando] = useState(false)

  if (confirmando) {
    return (
      <span className="inline-flex gap-1">
        <button
          type="button"
          disabled={desabilitado}
          onClick={() => {
            setConfirmando(false)
            onConfirmar()
          }}
          className="inline-flex h-11 items-center rounded-xl bg-perigo px-3 text-sm font-bold text-white hover:brightness-110"
        >
          {confirmacao}
        </button>
        <button
          type="button"
          onClick={() => setConfirmando(false)}
          className="inline-flex h-11 items-center rounded-xl px-3 text-sm font-semibold text-texto-suave hover:bg-acai-100"
        >
          Não
        </button>
      </span>
    )
  }

  return (
    <button
      type="button"
      disabled={desabilitado}
      onClick={() => setConfirmando(true)}
      className={estilos.botaoPerigo}
    >
      {children}
    </button>
  )
}
