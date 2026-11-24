import { Breadcrumbs, type Crumb } from './Breadcrumbs'
import { Dots, Shards } from './Decor'
import { Highlight } from './Highlight'

/** Cabecera de páginas internas (servicios, equipo, blog, contacto). */
export function PageHeader({
  eyebrow,
  title,
  intro,
  badge,
  breadcrumbs,
  children,
}: {
  eyebrow?: string | null
  title: string
  intro?: string | null
  badge?: string
  breadcrumbs?: Crumb[]
  children?: React.ReactNode
}) {
  return (
    <section className="surface-dark on-dark relative isolate overflow-hidden">
      <Shards className="-z-10" line />
      <Dots className="top-20 left-0 h-48 w-48" />
      <div className="container-site relative pt-32 pb-16 sm:pt-40 sm:pb-20">
        <div className="max-w-4xl animate-rise">
          {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
          {badge && <span className="badge mb-6">{badge}</span>}
          {eyebrow && <p className="eyebrow eyebrow-start mb-5 text-sky">{eyebrow}</p>}
          <h1 className="headline-lg text-white">
            <Highlight text={title} className="text-electric-2" />
          </h1>
          <span className="mt-6 block h-1 w-16 bg-electric" aria-hidden />
          {intro && <p className="mt-6 max-w-2xl text-base leading-relaxed text-haze sm:text-lg">{intro}</p>}
          {children}
        </div>
      </div>
    </section>
  )
}
