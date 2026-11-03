import Tigela from './Tigela.tsx'

export default function Marca({ className = 'h-11 w-11' }: { className?: string }) {
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-2xl bg-acai-800 ${className}`}>
      <Tigela className="w-[70%]" />
    </span>
  )
}
