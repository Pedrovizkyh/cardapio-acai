import { useState, type FormEvent } from 'react'
import { Navigate } from 'react-router'
import { useSessao } from '../../admin/sessao.ts'
import { useLogin } from '../../api/admin.ts'
import { mensagemDeErro } from '../../api/cliente.ts'

const campo =
  'mt-1 w-full rounded-xl bg-white p-3 text-acai-900 ring-1 ring-acai-200 focus:outline-2 focus:outline-acai-500'

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
    <div className="flex min-h-dvh items-center justify-center bg-acai-900 px-4">
      <form onSubmit={enviar} className="w-full max-w-sm rounded-2xl bg-acai-50 p-6 shadow-xl">
        <p className="text-center text-4xl" aria-hidden>
          🍇
        </p>
        <h1 className="mt-2 text-center text-xl font-extrabold">Painel · Açaí da Orla</h1>

        <label htmlFor="email" className="mt-6 block font-bold">
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

        <label htmlFor="senha" className="mt-4 block font-bold">
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
          <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800">
            {mensagemDeErro(login.error)}
          </p>
        )}

        <button
          type="submit"
          disabled={login.isPending}
          className="mt-6 w-full rounded-full bg-acai-700 py-3 font-bold text-white hover:bg-acai-800 disabled:opacity-60"
        >
          {login.isPending ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
