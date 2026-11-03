import { Link } from 'react-router'

export default function NaoEncontrada() {
  return (
    <section className="mt-10 text-center">
      <p className="text-5xl" aria-hidden>
        🍧
      </p>
      <h1 className="mt-3 text-xl font-extrabold">Página não encontrada</h1>
      <p className="mt-1 text-acai-700">Esse endereço não existe por aqui.</p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-full bg-acai-700 px-6 py-3 font-bold text-white hover:bg-acai-800"
      >
        Ver cardápio
      </Link>
    </section>
  )
}
