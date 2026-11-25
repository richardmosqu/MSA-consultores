// "Tu empresa en *orden*": lo que va entre asteriscos se destaca.
// Sobre fondo claro → azul de MSA. Sobre fondo oscuro → blanco pleno y el resto atenuado.
export function Highlight({ text, dark = false }: { text?: string | null; dark?: boolean }) {
  if (!text) return null
  const parts = text.split(/(\*[^*]+\*)/g).filter(Boolean)
  const hasHighlight = parts.some((p) => p.startsWith('*'))
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('*') && part.endsWith('*') ? (
          <span key={i} className={`hl ${dark ? 'text-white' : 'text-accent'}`}>
            {part.slice(1, -1)}
          </span>
        ) : (
          <span key={i} className={dark && hasHighlight ? 'hl-dim text-white/60' : undefined}>
            {part}
          </span>
        ),
      )}
    </>
  )
}

export const plain = (text?: string | null) => (text ?? '').replace(/\*/g, '')
