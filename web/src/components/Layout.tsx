import { Outlet } from 'react-router'

// Cada tela do cliente monta o próprio topo (cabeçalho, botão de voltar ou capa).
export default function Layout() {
  return (
    <main className="mx-auto min-h-dvh w-full max-w-xl px-4">
      <Outlet />
    </main>
  )
}
