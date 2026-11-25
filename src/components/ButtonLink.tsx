import Link from 'next/link'
import { Icon } from './Icon'
import type { ResolvedLink } from '@/lib/links'

type Variant = 'accent' | 'light' | 'outline' | 'glass' | 'whatsapp'

const pill: Record<Variant, string> = {
  accent: 'btn-accent',
  light: 'btn-light',
  outline: 'btn-outline',
  glass: 'btn-glass',
  whatsapp: 'btn-whatsapp',
}
const circle: Record<Variant, string> = {
  accent: 'bg-accent text-white group-hover:bg-accent-2',
  light: 'bg-white text-ink',
  outline: 'border border-line bg-white text-ink',
  glass: 'border border-white/25 bg-white/10 text-white backdrop-blur',
  whatsapp: 'bg-whatsapp text-ink',
}

/** Botón píldora + círculo con flecha (como "Free consultation ↗"). */
export function ButtonLink({
  link,
  label,
  variant = 'accent',
  className = '',
  arrow = true,
}: {
  link: ResolvedLink
  label: string
  variant?: Variant
  className?: string
  arrow?: boolean
}) {
  const content = (
    <>
      <span className={`${pill[variant]} gap-2`}>
        {link.kind === 'whatsapp' && <Icon name="whatsapp" className="size-4.5" />}
        {label}
      </span>
      {arrow && link.kind !== 'whatsapp' && (
        <span className={`arrow-circle size-12 transition group-hover:rotate-45 ${circle[variant]}`} aria-hidden>
          <Icon name="arrowUpRight" className="size-4.5" strokeWidth={2} />
        </span>
      )}
    </>
  )
  const cls = `group inline-flex items-center gap-1 ${className}`
  if (link.external) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer" className={cls} data-track={link.kind}>
        {content}
      </a>
    )
  }
  return (
    <Link href={link.href} className={cls} data-track={link.kind}>
      {content}
    </Link>
  )
}

/** Círculo blanco con flecha, para la esquina de las tarjetas. */
export function CornerArrow({ dark = false, className = '' }: { dark?: boolean; className?: string }) {
  return (
    <span
      aria-hidden
      className={`arrow-circle size-10 transition duration-300 group-hover:rotate-45 ${
        dark ? 'bg-white/15 text-white' : 'bg-white text-ink shadow-[0_2px_10px_-4px_rgba(12,26,71,0.25)]'
      } ${className}`}
    >
      <Icon name="arrowUpRight" className="size-4" strokeWidth={2} />
    </span>
  )
}

/** "Ver todo ↗" discreto para encabezados de sección. */
export function MoreLink({ href, label, dark = false }: { href: string; label: string; dark?: boolean }) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2 text-sm font-semibold ${dark ? 'text-white' : 'text-ink'}`}
    >
      {label}
      <CornerArrow dark={dark} />
    </Link>
  )
}
