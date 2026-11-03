import { Route, Routes } from 'react-router'
import Layout from './components/Layout.tsx'
import Cardapio from './pages/Cardapio.tsx'
import Carrinho from './pages/Carrinho.tsx'
import Checkout from './pages/Checkout.tsx'
import EmConstrucao from './pages/EmConstrucao.tsx'
import Montagem from './pages/Montagem.tsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Cardapio />} />
        <Route path="/produto/:id" element={<Montagem />} />
        <Route path="/carrinho" element={<Carrinho />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/pedido/confirmado" element={<EmConstrucao titulo="Pedido recebido" />} />
        <Route path="*" element={<EmConstrucao titulo="Página não encontrada" />} />
      </Route>
      <Route path="/admin/*" element={<EmConstrucao titulo="Painel" />} />
    </Routes>
  )
}
