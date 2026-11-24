import type { Page } from '@/payload-types'
import type { Site } from '@/lib/site'
import { resolveLink } from '@/lib/links'
import { Breadcrumbs, type Crumb } from '../Breadcrumbs'
import { ButtonLink } from '../ButtonLink'
import { Dots, Shards } from '../Decor'
import { Highlight } from '../Highlight'
import { MediaImage, hasMedia } from '../Media'

type HeroData = Extract<NonNullable<Page['layout']>[number], { blockType: 'hero' }>

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

  return (
    <section className="surface-dark on-dark relative isolate overflow-hidden">
      {withImage && (
        <div className="absolute inset-0 -z-10">
          <MediaImage media={block.image} size="wide" priority={first} className="opacity-45" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-navy/85 to-navy/30" />
        </div>
      )}
      <Shards className="-z-10" line />
      <Dots className="top-24 left-0 h-56 w-56" />

      <div
        className={`container-site relative ${large ? 'pt-36 pb-24 sm:pt-44 sm:pb-32 lg:min-h-[88svh] lg:pt-48' : 'pt-32 pb-16 sm:pt-40 sm:pb-20'} flex flex-col justify-center`}
      >
        <div className="max-w-4xl animate-rise">
          {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
          {block.eyebrow && <p className="eyebrow eyebrow-start mb-6 text-sky">{block.eyebrow}</p>}
          <h1 className={large ? 'headline-xl text-white' : 'headline-lg text-white'}>
            <Highlight text={block.title} className="text-electric-2" />
          </h1>
          <span className="mt-7 block h-1 w-16 bg-electric" aria-hidden />
          {block.subtitle && (
            <p className="mt-7 max-w-2xl text-base leading-relaxed text-haze sm:text-lg">{block.subtitle}</p>
          )}
          {(primary || secondary) && (
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              {primary && (
                <ButtonLink link={primary} label={primary.label || site.dict.nav.book} variant="primary" />
              )}
              {secondary && (
                <ButtonLink
                  link={secondary}
                  label={secondary.label || site.dict.common.learnMore}
                  variant={secondary.kind === 'whatsapp' ? 'whatsapp' : 'ghost-dark'}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
