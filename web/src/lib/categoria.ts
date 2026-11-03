export function emojiDaCategoria(nome: string): string {
  const n = nome.toLowerCase()
  if (n.includes('açaí') || n.includes('acai')) return '🍇'
  if (n.includes('creme')) return '🍨'
  if (n.includes('bebida')) return '🥤'
  return '🍧'
}
