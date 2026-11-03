type Props = {
  imagem: string | null
  nome: string
  emoji: string
  className?: string
}

export default function ImagemProduto({ imagem, nome, emoji, className = '' }: Props) {
  if (imagem) {
    return (
      <img
        src={imagem}
        alt={nome}
        loading="lazy"
        className={`object-cover ${className}`}
      />
    )
  }

  return (
    <div
      role="img"
      aria-label={nome}
      className={`flex items-center justify-center bg-linear-to-br from-acai-500 via-acai-700 to-acai-900 ${className}`}
    >
      <span aria-hidden className="text-4xl drop-shadow">
        {emoji}
      </span>
    </div>
  )
}
