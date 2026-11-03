import { useState, type ReactNode } from 'react'
import { mensagemDeErro } from '../api/cliente.ts'

export function Alerta({ erro }: { erro: unknown }) {
  if (!erro) return null
  return (
    <p role="alert" className="mt-2 rounded-lg bg-red-50 p-2 text-sm font-semibold text-red-800">
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
          className="rounded-full bg-red-700 px-3 py-2 text-sm font-bold text-white hover:bg-red-800"
        >
          {confirmacao}
        </button>
        <button
          type="button"
          onClick={() => setConfirmando(false)}
          className="rounded-full px-3 py-2 text-sm font-semibold text-acai-700"
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
      className="rounded-full px-3 py-2 text-sm font-semibold text-red-700 ring-1 ring-red-200 hover:bg-red-50 disabled:opacity-60"
    >
      {children}
    </button>
  )
}
