import Link from 'next/link'
import type { ServiceLink } from '@/lib/site'
import { Icon } from './Icon'

/**
 * Barra de áreas fija bajo el header (móvil y escritorio): permite saltar entre servicios
 * sin volver al listado. El área actual queda marcada.
 */
export function ServicesBar({ links, current, label }: { links: ServiceLink[]; current?: string; label: string }) {
  return (
    <nav aria-label={label} className="sticky top-18 z-30 border-b border-line bg-white/95 backdrop-blur lg:top-20">
      <div className="container-site">
        <ul className="-mx-4 flex snap-x gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
          {links.map((l) => {
            const active = l.href === current
            return (
              <li key={l.href} className="snap-start">
                <Link
                  href={l.href}
                  aria-current={active ? 'page' : undefined}
                  className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide transition ${
                    active ? 'bg-navy text-white' : 'border border-line text-navy hover:border-electric hover:text-electric'
                  }`}
                >
                  <Icon name={l.icon} className="size-4" />
                  {l.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}

/** Lista lateral con todas las áreas (escritorio) en la página de cada servicio. */
export function ServicesSideNav({
  links,
  current,
  title,
  allHref,
  allLabel,
}: {
  links: ServiceLink[]
  current: string
  title: string
  allHref: string
  allLabel: string
}) {
  return (
    <nav aria-label={title} className="rounded-2xl border border-line p-3">
      <p className="px-3 pt-2 pb-3 text-xs font-semibold uppercase tracking-widest text-slate">{title}</p>
      <ul className="space-y-0.5">
        {links.map((l) => {
          const active = l.href === current
          return (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition ${
                  active ? 'bg-navy text-white' : 'text-ink hover:bg-mist hover:text-electric'
                }`}
              >
                <Icon name={l.icon} className={`size-5 ${active ? 'text-sky' : 'text-electric'}`} />
                {l.label}
              </Link>
            </li>
          )
        })}
      </ul>
      <Link href={allHref} className="mt-2 flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-navy hover:text-electric">
        <Icon name="menu" className="size-4" />
        {allLabel}
      </Link>
    </nav>
  )
}

/** "← Área anterior | Área siguiente →" al final de cada servicio. */
export function ServicesPager({
  links,
  current,
  prevLabel,
  nextLabel,
}: {
  links: ServiceLink[]
  current: string
  prevLabel: string
  nextLabel: string
}) {
  const i = links.findIndex((l) => l.href === current)
  if (i < 0 || links.length < 2) return null
  const prev = links[(i - 1 + links.length) % links.length]
  const next = links[(i + 1) % links.length]
  return (
    <nav aria-label="Servicios" className="grid gap-3 sm:grid-cols-2">
      <Link href={prev.href} className="group rounded-2xl border border-line p-5 transition hover:border-electric">
        <span className="text-xs font-semibold uppercase tracking-widest text-slate">← {prevLabel}</span>
        <span className="mt-1 block font-black uppercase text-ink group-hover:text-electric">{prev.label}</span>
      </Link>
      <Link href={next.href} className="group rounded-2xl border border-line p-5 text-right transition hover:border-electric">
        <span className="text-xs font-semibold uppercase tracking-widest text-slate">{nextLabel} →</span>
        <span className="mt-1 block font-black uppercase text-ink group-hover:text-electric">{next.label}</span>
      </Link>
    </nav>
  )
}
