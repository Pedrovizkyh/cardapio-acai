import { Link } from 'react-router'
import Tigela from '../components/Tigela.tsx'

export default function NaoEncontrada() {
  return (
    <section className="pt-20 text-center">
      <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-[28px] bg-acai-100">
        <Tigela esgotado className="w-20" />
      </div>
      <h1 className="mt-5 text-2xl font-extrabold">Página não encontrada</h1>
      <p className="mt-1 text-texto-suave">Esse endereço não existe por aqui.</p>
      <Link
        to="/"
        className="mt-6 inline-flex h-13 items-center rounded-2xl bg-acai-950 px-6 font-bold text-white transition hover:bg-acai-800"
      >
        Ver cardápio
      </Link>
    </section>
  )
}
