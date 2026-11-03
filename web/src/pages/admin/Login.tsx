import { useState, type FormEvent } from 'react'
import { Navigate } from 'react-router'
import { useSessao } from '../../admin/sessao.ts'
import { useLogin } from '../../api/admin.ts'
import { mensagemDeErro } from '../../api/cliente.ts'
import Marca from '../../components/Marca.tsx'
import { loja } from '../../lib/loja.ts'

const campo =
  'mt-1.5 h-12 w-full rounded-xl bg-white px-4 text-acai-950 ring-1 ring-acai-200 focus:outline-2 focus:outline-acai-500'

export default function Login() {
  const { token, entrar } = useSessao()
  const login = useLogin()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  if (token) return <Navigate to="/admin" replace />

  function enviar(evento: FormEvent) {
    evento.preventDefault()
    login.mutate(
      { email: email.trim(), senha },
      { onSuccess: ({ accessToken }) => entrar(accessToken, email.trim()) },
    )
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-acai-950 px-4">
      <form onSubmit={enviar} className="w-full max-w-sm rounded-[28px] bg-acai-50 p-7 shadow-2xl">
        <Marca className="mx-auto h-14 w-14" />
        <h1 className="mt-4 text-center text-2xl font-extrabold">{loja.nome}</h1>
        <p className="text-center text-sm text-texto-suave">Painel da loja</p>

        <label htmlFor="email" className="mt-6 block text-sm font-bold">
          E-mail
        </label>
        <input
          id="email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={campo}
        />

        <label htmlFor="senha" className="mt-4 block text-sm font-bold">
          Senha
        </label>
        <input
          id="senha"
          type="password"
          autoComplete="current-password"
          required
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className={campo}
        />

        {login.isError && (
          <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-perigo">
            {mensagemDeErro(login.error)}
          </p>
        )}

        <button
          type="submit"
          disabled={login.isPending}
          className="mt-6 h-13 w-full rounded-2xl bg-acai-950 font-bold text-white transition hover:bg-acai-800 disabled:opacity-60"
        >
          {login.isPending ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
