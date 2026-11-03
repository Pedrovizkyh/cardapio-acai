import { useQueryClient } from '@tanstack/react-query'
import { Navigate, NavLink, Outlet } from 'react-router'
import { useSessao } from '../../admin/sessao.ts'
import Marca from '../../components/Marca.tsx'
import { loja } from '../../lib/loja.ts'

const aba = ({ isActive }: { isActive: boolean }) =>
  `shrink-0 rounded-xl px-4 py-2 text-sm font-bold transition ${
    isActive ? 'bg-white/12 text-white' : 'text-acai-200 hover:bg-white/6 hover:text-white'
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
      <header className="sticky top-0 z-20 bg-acai-950 text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 sm:px-6">
          <p className="flex items-center gap-3 font-display text-lg font-bold">
            <Marca className="h-10 w-10 rounded-xl" />
            <span>
              {loja.nome} <span className="font-semibold text-acai-300">· Painel</span>
            </span>
          </p>
          <nav aria-label="Seções do painel" className="order-last -mx-1 flex w-full gap-1 overflow-x-auto px-1 md:order-none md:w-auto">
            <NavLink to="/admin" end className={aba}>
              Pedidos
            </NavLink>
            <NavLink to="/admin/cardapio" className={aba}>
              Cardápio
            </NavLink>
            <NavLink to="/admin/adicionais" className={aba}>
              Adicionais
            </NavLink>
          </nav>
          <div className="ml-auto flex items-center gap-4">
            <span className="hidden text-sm text-acai-200 sm:inline">{email}</span>
            <button
              type="button"
              onClick={deslogar}
              className="h-10 rounded-xl px-4 text-sm font-bold ring-1 ring-white/25 transition hover:bg-white/10"
            >
              Sair
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 pt-8 pb-12 sm:px-6">
        <Outlet />
      </main>
    </div>
  )
}
