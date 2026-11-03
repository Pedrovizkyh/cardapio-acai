import { Route, Routes } from 'react-router'
import EmConstrucao from './pages/EmConstrucao.tsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<EmConstrucao titulo="Cardápio" />} />
      <Route path="/produto/:id" element={<EmConstrucao titulo="Produto" />} />
      <Route path="/carrinho" element={<EmConstrucao titulo="Carrinho" />} />
      <Route path="/checkout" element={<EmConstrucao titulo="Checkout" />} />
      <Route path="/admin/*" element={<EmConstrucao titulo="Painel" />} />
      <Route path="*" element={<EmConstrucao titulo="Página não encontrada" />} />
    </Routes>
  )
}
