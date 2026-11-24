import Link from 'next/link'
import { Icon } from './Icon'
import type { ResolvedLink } from '@/lib/links'

type Variant = 'primary' | 'ghost-dark' | 'ghost-light' | 'whatsapp'

const variantClass: Record<Variant, string> = {
  primary: 'btn-primary',
  'ghost-dark': 'btn-ghost-dark',
  'ghost-light': 'btn-ghost-light',
  whatsapp: 'btn-whatsapp',
}

export function ButtonLink({
  link,
  label,
  variant = 'primary',
  className = '',
}: {
  link: ResolvedLink
  label: string
  variant?: Variant
  className?: string
}) {
  const icon =
    link.kind === 'whatsapp' ? 'whatsapp' : link.kind === 'booking' ? 'calendar' : 'arrow'
  const content = (
    <>
      {icon !== 'arrow' && <Icon name={icon} className="size-5" />}
      <span>{label}</span>
      {icon === 'arrow' && <Icon name="arrow" className="size-4" />}
    </>
  )
  const cls = `${variantClass[variant]} ${className}`
  const track = { 'data-track': link.kind }
  if (link.external) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer" className={cls} {...track}>
        {content}
      </a>
    )
  }
  return (
    <Link href={link.href} className={cls} {...track}>
      {content}
    </Link>
  )
}

/** "Conoce más ›" con el círculo azul de las piezas de Instagram. */
export function MoreLink({ href, label, dark = false }: { href: string; label: string; dark?: boolean }) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2 text-sm font-semibold ${dark ? 'text-white' : 'text-navy'}`}
    >
      {label}
      <span className="grid size-6 place-items-center rounded-full bg-electric text-white transition group-hover:translate-x-0.5">
        <Icon name="chevron" className="size-3.5" strokeWidth={2.4} />
      </span>
    </Link>
  )
}
