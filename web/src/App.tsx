import { Route, Routes } from 'react-router'
import Layout from './components/Layout.tsx'
import Cardapio from './pages/Cardapio.tsx'
import EmConstrucao from './pages/EmConstrucao.tsx'
import Montagem from './pages/Montagem.tsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Cardapio />} />
        <Route path="/produto/:id" element={<Montagem />} />
        <Route path="/carrinho" element={<EmConstrucao titulo="Carrinho" />} />
        <Route path="/checkout" element={<EmConstrucao titulo="Checkout" />} />
        <Route path="*" element={<EmConstrucao titulo="Página não encontrada" />} />
      </Route>
      <Route path="/admin/*" element={<EmConstrucao titulo="Painel" />} />
    </Routes>
  )
}
