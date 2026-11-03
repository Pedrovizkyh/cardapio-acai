import { useQueryClient } from '@tanstack/react-query'
import { Navigate, NavLink, Outlet } from 'react-router'
import { useSessao } from '../../admin/sessao.ts'

const aba = ({ isActive }: { isActive: boolean }) =>
  `rounded-full px-4 py-1.5 text-sm font-semibold ${
    isActive ? 'bg-lima-400 text-acai-900' : 'text-acai-100 hover:bg-acai-800'
  }`

export default function LayoutAdmin() {
  const { token, email, sair } = useSessao()
  const queryClient = useQueryClient()

  if (!token) return <Navigate to="/admin/login" replace />

  function deslogar() {
    sair()
    queryClient.removeQueries({ queryKey: ['admin'] })
  }

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-10 bg-acai-900 text-white shadow-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <p className="font-extrabold">
            <span aria-hidden>🍇 </span>Painel · Açaí da Orla
          </p>
          <button
            type="button"
            onClick={deslogar}
            className="text-sm text-acai-200 underline hover:text-white"
            title={email ?? undefined}
          >
            Sair
          </button>
        </div>
        <nav className="mx-auto flex max-w-3xl gap-2 px-4 pb-3">
          <NavLink to="/admin" end className={aba}>
            Pedidos
          </NavLink>
          <NavLink to="/admin/cardapio" className={aba}>
            Cardápio
          </NavLink>
        </nav>
      </header>
      <main className="mx-auto max-w-3xl px-4 pb-10">
        <Outlet />
      </main>
    </div>
  )
}
