type Props = { esgotado?: boolean; className?: string }

// Ilustração usada quando o produto não tem foto.
export default function Tigela({ esgotado = false, className = '' }: Props) {
  return (
    <svg viewBox="0 0 120 100" aria-hidden className={className}>
      {!esgotado && (
        <>
          <circle cx="40" cy="40" r="14" fill="#c6e84a" />
          <circle cx="61" cy="31" r="14" fill="#f2d7a0" />
          <circle cx="81" cy="41" r="13" fill="#ef6b8a" />
        </>
      )}
      <rect x="10" y="45" width="100" height="9" rx="4.5" fill={esgotado ? '#9b8ba3' : '#1e0d24'} />
      <path d="M14 53h92a46 40 0 0 1-92 0z" fill={esgotado ? '#efe8f2' : '#f7f1f8'} />
    </svg>
  )
}
