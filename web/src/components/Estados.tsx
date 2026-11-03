type ErroProps = { mensagem: string; onTentarDeNovo?: () => void }

export function MensagemErro({ mensagem, onTentarDeNovo }: ErroProps) {
  return (
    <div
      role="alert"
      className="mt-6 rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-red-200"
    >
      <p className="text-3xl" aria-hidden>
        😕
      </p>
      <p className="mt-2 font-semibold text-acai-900">{mensagem}</p>
      {onTentarDeNovo && (
        <button
          type="button"
          onClick={onTentarDeNovo}
          className="mt-4 rounded-full bg-acai-700 px-5 py-2 font-semibold text-white hover:bg-acai-800"
        >
          Tentar de novo
        </button>
      )}
    </div>
  )
}

export function EsqueletoLista({ linhas = 4 }: { linhas?: number }) {
  return (
    <div aria-busy="true" aria-label="Carregando" className="mt-6 space-y-3">
      {Array.from({ length: linhas }, (_, i) => (
        <div
          key={i}
          className="flex animate-pulse gap-3 rounded-2xl bg-white p-3 ring-1 ring-acai-100"
        >
          <div className="h-24 w-24 rounded-xl bg-acai-100" />
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 w-2/3 rounded bg-acai-100" />
            <div className="h-3 w-full rounded bg-acai-100" />
            <div className="h-3 w-1/3 rounded bg-acai-100" />
          </div>
        </div>
      ))}
    </div>
  )
}
