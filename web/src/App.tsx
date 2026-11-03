import { Route, Routes } from 'react-router'
import Layout from './components/Layout.tsx'
import Cardapio from './pages/Cardapio.tsx'
import Carrinho from './pages/Carrinho.tsx'
import Checkout from './pages/Checkout.tsx'
import Confirmacao from './pages/Confirmacao.tsx'
import Montagem from './pages/Montagem.tsx'
import NaoEncontrada from './pages/NaoEncontrada.tsx'
import CardapioAdmin from './pages/admin/CardapioAdmin.tsx'
import EditarProduto from './pages/admin/EditarProduto.tsx'
import LayoutAdmin from './pages/admin/LayoutAdmin.tsx'
import Login from './pages/admin/Login.tsx'
import PedidosAdmin from './pages/admin/PedidosAdmin.tsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Cardapio />} />
        <Route path="/produto/:id" element={<Montagem />} />
        <Route path="/carrinho" element={<Carrinho />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/pedido/confirmado" element={<Confirmacao />} />
        <Route path="*" element={<NaoEncontrada />} />
      </Route>
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin" element={<LayoutAdmin />}>
        <Route index element={<PedidosAdmin />} />
        <Route path="cardapio" element={<CardapioAdmin />} />
        <Route path="cardapio/produtos/:id" element={<EditarProduto />} />
      </Route>
    </Routes>
  )
}
