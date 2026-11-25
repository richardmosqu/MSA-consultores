import { Breadcrumbs, type Crumb } from './Breadcrumbs'
import { Highlight } from './Highlight'

/** Cabecera de páginas internas: marco azul noche redondeado, sobrio. */
export function PageHeader({
  eyebrow,
  title,
  intro,
  breadcrumbs,
  children,
}: {
  eyebrow?: string | null
  title: string
  intro?: string | null
  breadcrumbs?: Crumb[]
  children?: React.ReactNode
}) {
  return (
    <section className="pt-2 sm:pt-3">
      <div className="frame on-dark relative isolate overflow-hidden bg-ink text-white">
        <Glow />
        <div className="container-site relative pt-32 pb-14 sm:pt-40 sm:pb-20">
          <div className="max-w-3xl animate-rise">
            {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
            {eyebrow && <p className="pill-label-dark mb-5">{eyebrow}</p>}
            <h1 className="display-lg text-white">
              <Highlight text={title} dark />
            </h1>
            {intro && <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">{intro}</p>}
            {children}
          </div>
        </div>
      </div>
    </section>
  )
}

/** Único recurso decorativo: un halo azul muy suave en la esquina. */
export function Glow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -top-1/3 -right-1/4 -z-10 size-[70vmax] rounded-full bg-[radial-gradient(closest-side,rgba(36,84,245,0.35),transparent)]"
    />
  )
}
