'use client'

import { useSearchParams } from 'next/navigation'

// Filtro de categorías en el navegador: la página del blog sigue sirviéndose desde caché.
// La categoría queda en la URL (?c=noticias) para poder compartir el enlace.

type Item = { id: number; category: string; node: React.ReactNode }
type Props = {
  categories: { value: string; label: string }[]
  items: Item[]
  label: string
  empty: string
}

export function BlogFilter(props: Props) {
  const searchParams = useSearchParams()
  const c = searchParams.get('c')
  const active = c && props.categories.some((cat) => cat.value === c) ? c : 'all'

  const select = (value: string) => {
    const url = new URL(window.location.href)
    if (value === 'all') url.searchParams.delete('c')
    else url.searchParams.set('c', value)
    // Next sincroniza history.replaceState con useSearchParams, sin recargar la página.
    window.history.replaceState(null, '', url)
  }

  return <BlogFilterView {...props} active={active} onSelect={select} />
}

/** Vista sin estado: también se usa como HTML inicial (todas las publicaciones) mientras hidrata. */
export function BlogFilterView({
  categories,
  items,
  label,
  empty,
  active = 'all',
  onSelect,
}: Props & { active?: string; onSelect?: (value: string) => void }) {
  const visible = items.filter((i) => active === 'all' || i.category === active)
  return (
    <>
      <div role="tablist" aria-label={label} className="mb-10 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.value}
            type="button"
            role="tab"
            aria-selected={cat.value === active}
            onClick={() => onSelect?.(cat.value)}
            className={`rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-widest transition ${
              cat.value === active
                ? 'bg-ink text-white'
                : 'border border-line text-ink hover:border-accent hover:text-accent'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
      {visible.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((i) => (
            <div key={i.id}>{i.node}</div>
          ))}
        </div>
      ) : (
        <p className="rounded-2xl bg-surface p-10 text-center text-muted">{empty}</p>
      )}
    </>
  )
}
