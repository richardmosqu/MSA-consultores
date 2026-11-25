import Link from 'next/link'
import type { ServiceLink } from '@/lib/site'
import { Icon } from './Icon'

/**
 * Barra de áreas fija bajo el header: permite saltar entre servicios sin volver al listado.
 * El área actual queda marcada.
 */
export function ServicesBar({ links, current, label }: { links: ServiceLink[]; current?: string; label: string }) {
  return (
    <nav aria-label={label} className="sticky top-[4.75rem] z-30 py-3 sm:top-[5.5rem]">
      <div className="container-site">
        <ul className="-mx-5 flex snap-x gap-2 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden">
          {links.map((l) => {
            const active = l.href === current
            return (
              <li key={l.href} className="snap-start">
                <Link
                  href={l.href}
                  aria-current={active ? 'page' : undefined}
                  className={`inline-flex items-center gap-2 rounded-dot py-1.5 pr-4 pl-1.5 text-sm font-medium whitespace-nowrap shadow-[0_6px_20px_-12px_rgba(12,26,71,0.35)] transition ${
                    active ? 'bg-ink text-white' : 'bg-white text-ink ring-1 ring-line hover:ring-accent'
                  }`}
                >
                  <span
                    className={`grid size-7 place-items-center rounded-dot ${active ? 'bg-white/15 text-white' : 'bg-accent-soft text-accent'}`}
                  >
                    <Icon name={l.icon} className="size-3.5" />
                  </span>
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
    <nav aria-label={title} className="rounded-card bg-surface p-3">
      <p className="px-3 pt-3 pb-4 text-xs font-semibold tracking-[0.12em] text-muted uppercase">{title}</p>
      <ul className="space-y-1">
        {links.map((l) => {
          const active = l.href === current
          return (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-3 rounded-ui px-3 py-2.5 text-sm font-medium transition ${
                  active ? 'bg-white text-ink shadow-[0_6px_20px_-12px_rgba(12,26,71,0.35)]' : 'text-ink/75 hover:bg-white/60 hover:text-ink'
                }`}
              >
                <span
                  className={`grid size-8 shrink-0 place-items-center rounded-dot ${active ? 'bg-accent text-white' : 'bg-white text-accent'}`}
                >
                  <Icon name={l.icon} className="size-4" />
                </span>
                {l.label}
              </Link>
            </li>
          )
        })}
      </ul>
      <Link
        href={allHref}
        className="mt-2 flex items-center justify-between rounded-ui px-3 py-3 text-sm font-semibold text-ink hover:bg-white/60"
      >
        {allLabel}
        <Icon name="arrowUpRight" className="size-4" />
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
    <nav aria-label={prevLabel + ' / ' + nextLabel} className="grid gap-3 sm:grid-cols-2">
      <Link href={prev.href} className="group rounded-card bg-surface p-6 transition hover:bg-[#eceff5]">
        <span className="text-xs font-semibold tracking-[0.12em] text-muted uppercase">← {prevLabel}</span>
        <span className="mt-2 block font-display text-xl text-ink">{prev.label}</span>
      </Link>
      <Link href={next.href} className="group rounded-card bg-surface p-6 text-right transition hover:bg-[#eceff5]">
        <span className="text-xs font-semibold tracking-[0.12em] text-muted uppercase">{nextLabel} →</span>
        <span className="mt-2 block font-display text-xl text-ink">{next.label}</span>
      </Link>
    </nav>
  )
}
