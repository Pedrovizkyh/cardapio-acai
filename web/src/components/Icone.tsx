const caminhos = {
  sacola: 'M6 8h12l-1 12H7L6 8Zm3 0V7a3 3 0 0 1 6 0v1',
  voltar: 'M15 5l-7 7 7 7',
  mais: 'M12 5v14M5 12h14',
  menos: 'M5 12h14',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  conversa:
    'M4 12a8 8 0 1 1 3.4 6.5L4 20l1.5-3.4A7.9 7.9 0 0 1 4 12Z',
  sair: 'M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 8l-4 4 4 4M6 12h10',
  lapis: 'M4 20h4L19 9l-4-4L4 16v4Z',
}

export type NomeIcone = keyof typeof caminhos

export default function Icone({ nome, className = 'h-5 w-5' }: { nome: NomeIcone; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d={caminhos[nome]} />
    </svg>
  )
}
