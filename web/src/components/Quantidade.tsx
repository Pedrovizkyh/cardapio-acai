import Icone from './Icone.tsx'

type Props = {
  valor: number
  minimo?: number
  maximo: number
  onChange: (valor: number) => void
  rotulo: string
}

export default function Quantidade({ valor, minimo = 1, maximo, onChange, rotulo }: Props) {
  const botao =
    'flex h-10 w-10 items-center justify-center rounded-xl text-acai-950 transition hover:bg-acai-100 disabled:opacity-30 disabled:hover:bg-transparent'

  return (
    <div
      className="flex h-14 items-center gap-1 rounded-2xl bg-white px-1.5 ring-1 ring-acai-200"
      role="group"
      aria-label={rotulo}
    >
      <button
        type="button"
        className={botao}
        onClick={() => onChange(valor - 1)}
        disabled={valor <= minimo}
        aria-label="Diminuir quantidade"
      >
        <Icone nome="menos" />
      </button>
      <span className="w-6 text-center text-lg font-bold" aria-live="polite">
        {valor}
      </span>
      <button
        type="button"
        className={botao}
        onClick={() => onChange(valor + 1)}
        disabled={valor >= maximo}
        aria-label="Aumentar quantidade"
      >
        <Icone nome="mais" />
      </button>
    </div>
  )
}
