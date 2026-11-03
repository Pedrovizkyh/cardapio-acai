import { Link } from 'react-router'
import Icone from './Icone.tsx'

type Props = { para: string; rotulo: string; className?: string }

export default function BotaoVoltar({ para, rotulo, className = '' }: Props) {
  return (
    <Link
      to={para}
      aria-label={rotulo}
      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-acai-950 shadow-sm ring-1 ring-acai-100 transition hover:bg-acai-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acai-500 ${className}`}
    >
      <Icone nome="voltar" className="h-6 w-6" />
    </Link>
  )
}
