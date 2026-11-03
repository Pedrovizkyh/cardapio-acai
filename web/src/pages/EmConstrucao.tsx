export default function EmConstrucao({ titulo }: { titulo: string }) {
  return (
    <section className="p-6 text-center">
      <h1 className="text-xl font-bold">{titulo}</h1>
      <p className="mt-2 text-acai-700">Em construção.</p>
    </section>
  )
}
