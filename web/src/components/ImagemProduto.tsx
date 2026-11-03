import Tigela from './Tigela.tsx'

type Props = {
  imagem: string | null
  nome: string
  id?: number
  esgotado?: boolean
  className?: string
}

const fundos = ['bg-acai-800', 'bg-acai-700', 'bg-acai-900']

export default function ImagemProduto({ imagem, nome, id = 0, esgotado = false, className = '' }: Props) {
  if (imagem) {
    return (
      <img
        src={imagem}
        alt={nome}
        loading="lazy"
        className={`object-cover ${esgotado ? 'opacity-50 grayscale' : ''} ${className}`}
      />
    )
  }

  return (
    <div
      role="img"
      aria-label={nome}
      className={`flex items-center justify-center ${esgotado ? 'bg-acai-200' : fundos[id % fundos.length]} ${className}`}
    >
      <Tigela esgotado={esgotado} className="w-[68%]" />
    </div>
  )
}
