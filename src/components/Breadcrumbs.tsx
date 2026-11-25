import Link from 'next/link'
import { Icon } from './Icon'

export type Crumb = { href?: string; label: string }

/** Migas de pan: "Inicio › Servicios › Fiscal y Tributario". Incluye datos estructurados para Google. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  if (items.length < 2) return null
  const base = process.env.NEXT_PUBLIC_SERVER_URL || ''
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: base + c.href } : {}),
    })),
  }
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-white/60">
        {items.map((c, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && <Icon name="chevron" className="size-3 opacity-60" />}
            {c.href && i < items.length - 1 ? (
              <Link href={c.href} className="hover:text-white">
                {c.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-white/90">
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </nav>
  )
}
