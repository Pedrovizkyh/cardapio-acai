type Props = {
  valor: number
  minimo?: number
  maximo: number
  onChange: (valor: number) => void
  rotulo: string
}

export default function Quantidade({ valor, minimo = 1, maximo, onChange, rotulo }: Props) {
  const botao =
    'flex h-9 w-9 items-center justify-center rounded-full bg-acai-100 text-lg font-bold text-acai-800 hover:bg-acai-200 disabled:opacity-40'

  return (
    <div className="flex items-center gap-3" role="group" aria-label={rotulo}>
      <button
        type="button"
        className={botao}
        onClick={() => onChange(valor - 1)}
        disabled={valor <= minimo}
        aria-label="Diminuir quantidade"
      >
        −
      </button>
      <span className="w-6 text-center font-bold" aria-live="polite">
        {valor}
      </span>
      <button
        type="button"
        className={botao}
        onClick={() => onChange(valor + 1)}
        disabled={valor >= maximo}
        aria-label="Aumentar quantidade"
      >
        +
      </button>
    </div>
  )
}
