// Ayudantes mínimos para escribir richText (Lexical) desde el seed.

const text = (t: string, format = 0) => ({
  type: 'text',
  text: t,
  format,
  style: '',
  mode: 'normal',
  detail: 0,
  version: 1,
})

const base = { format: '' as const, indent: 0, version: 1, direction: 'ltr' as const }

export const p = (t: string) => ({ ...base, type: 'paragraph', textFormat: 0, textStyle: '', children: [text(t)] })
export const h = (t: string, tag: 'h2' | 'h3' = 'h2') => ({ ...base, type: 'heading', tag, children: [text(t)] })
export const ul = (items: string[]) => ({
  ...base,
  type: 'list',
  listType: 'bullet',
  tag: 'ul',
  start: 1,
  children: items.map((t, i) => ({ ...base, type: 'listitem', value: i + 1, children: [text(t)] })),
})

type Node = ReturnType<typeof p> | ReturnType<typeof h> | ReturnType<typeof ul>

export const doc = (...children: Node[]) => ({
  root: { ...base, type: 'root', children },
})

/** Convierte párrafos separados por línea en blanco a richText. */
export const paragraphs = (t: string) =>
  doc(
    ...t
      .split(/\n\s*\n/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map(p),
  )
