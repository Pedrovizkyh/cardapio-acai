import { Outlet } from 'react-router'
import { contarItens, useCarrinho } from '../carrinho/carrinho.ts'
import Cabecalho from './Cabecalho.tsx'

export default function Layout() {
  const quantidade = useCarrinho((estado) => contarItens(estado.itens))

  return (
    <div className="flex min-h-dvh flex-col">
      <Cabecalho itensNoCarrinho={quantidade} />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-10">
        <Outlet />
      </main>
      <footer className="py-6 text-center text-xs text-acai-600">
        Açaí da Orla · marca fictícia para portfólio
      </footer>
    </div>
  )
}
