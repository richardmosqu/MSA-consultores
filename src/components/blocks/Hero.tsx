import Link from 'next/link'
import type { Page } from '@/payload-types'
import type { Site } from '@/lib/site'
import { resolveLink } from '@/lib/links'
import { Breadcrumbs, type Crumb } from '../Breadcrumbs'
import { ButtonLink } from '../ButtonLink'
import { Highlight } from '../Highlight'
import { Icon } from '../Icon'
import { MediaImage, hasMedia } from '../Media'
import { Glow } from '../PageHeader'

type HeroData = Extract<NonNullable<Page['layout']>[number], { blockType: 'hero' }>

/**
 * Portada: foto a sangre dentro de un marco redondeado, título de peso regular,
 * botón principal con flecha y, en la portada grande, accesos a las áreas de servicio.
 */
export function HeroBlock({
  block,
  site,
  first,
  breadcrumbs,
}: {
  block: HeroData
  site: Site
  first?: boolean
  breadcrumbs?: Crumb[]
}) {
  const ctx = { settings: site.settings, locale: site.locale, whatsappMessage: site.whatsappMessage }
  const primary = resolveLink(block.primary, ctx)
  const secondary = resolveLink(block.secondary, ctx)
  const large = block.size !== 'compact'
  const withImage = hasMedia(block.image)
  const shortcuts = large ? site.serviceLinks.slice(0, 3) : []

  return (
    <section className="pt-2 sm:pt-3">
      <div
        className={`frame on-dark relative isolate flex flex-col overflow-hidden bg-ink text-white ${
          large ? 'min-h-[640px] lg:min-h-[calc(100svh-1.5rem)]' : ''
        }`}
      >
        {withImage ? (
          <div className="absolute inset-0 -z-10">
            <MediaImage media={block.image} size="wide" priority={first} />
            <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/45 to-ink/5" />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/70 to-transparent" />
          </div>
        ) : (
          <Glow />
        )}

        <div
          className={`container-site relative flex flex-1 flex-col justify-center ${
            large ? 'pt-32 pb-10 sm:pt-36' : 'pt-32 pb-14 sm:pt-40 sm:pb-20'
          }`}
        >
          <div className="max-w-3xl animate-rise">
            {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
            {block.eyebrow && <p className="pill-label-dark mb-6">{block.eyebrow}</p>}
            <h1 className={large ? 'display-xl' : 'display-lg'}>
              <Highlight text={block.title} dark />
            </h1>
            {block.subtitle && (
              <p className="mt-6 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">{block.subtitle}</p>
            )}
            {(primary || secondary) && (
              <div className="mt-9 flex flex-wrap items-center gap-3">
                {primary && <ButtonLink link={primary} label={primary.label || site.dict.nav.book} />}
                {secondary && (
                  <ButtonLink
                    link={secondary}
                    label={secondary.label || site.dict.common.learnMore}
                    variant="glass"
                    arrow={false}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {shortcuts.length > 0 && (
          <nav aria-label={site.dict.common.serviceAreas} className="container-site relative pb-5 sm:pb-8">
            <ul className="-mx-5 flex gap-3 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-3 sm:px-0 [&::-webkit-scrollbar]:hidden">
              {shortcuts.map((s, i) => (
                <li key={s.href} className="min-w-[78%] sm:min-w-0">
                  <Link
                    href={s.href}
                    className={`group flex h-14 items-center justify-between rounded-2xl px-5 text-[0.7rem] font-semibold tracking-[0.12em] uppercase backdrop-blur transition ${
                      i === 0 ? 'bg-white text-ink' : 'bg-white/12 text-white/90 ring-1 ring-white/15 hover:bg-white/20'
                    }`}
                  >
                    {s.label}
                    <Icon name="arrowUpRight" className="size-4 transition group-hover:rotate-45" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </section>
  )
}
