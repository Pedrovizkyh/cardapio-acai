import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type Sessao = {
  token: string | null
  email: string | null
  entrar: (token: string, email: string) => void
  sair: () => void
}

export const useSessao = create<Sessao>()(
  persist(
    (set) => ({
      token: null,
      email: null,
      entrar: (token, email) => set({ token, email }),
      sair: () => set({ token: null, email: null }),
    }),
    {
      name: 'acai-da-orla:sessao',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
