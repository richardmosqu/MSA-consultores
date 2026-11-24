// Convierte "Tu empresa en *orden*" en texto con la palabra resaltada en azul eléctrico,
// el recurso tipográfico principal de las piezas de MSA.
export function Highlight({
  text,
  className = 'text-electric',
}: {
  text?: string | null
  className?: string
}) {
  if (!text) return null
  const parts = text.split(/(\*[^*]+\*)/g).filter(Boolean)
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('*') && part.endsWith('*') ? (
          <span key={i} className={className}>
            {part.slice(1, -1)}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  )
}

export const plain = (text?: string | null) => (text ?? '').replace(/\*/g, '')
