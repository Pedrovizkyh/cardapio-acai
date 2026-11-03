import type { ReactNode } from 'react'

// Faixa fixa no rodapé das telas do cliente, com o botão principal da tela.
export default function BarraInferior({ children }: { children: ReactNode }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 bg-linear-to-t from-acai-50 via-acai-50/95 to-acai-50/0 pt-6">
      <div className="pointer-events-auto mx-auto flex max-w-xl items-center gap-3 px-4 pb-4">
        {children}
      </div>
    </div>
  )
}

export const botaoPrincipal =
  'flex h-14 flex-1 items-center justify-between gap-3 rounded-2xl bg-acai-950 px-5 text-lg font-bold text-white shadow-xl shadow-acai-950/20 transition hover:bg-acai-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acai-500 disabled:opacity-60'
