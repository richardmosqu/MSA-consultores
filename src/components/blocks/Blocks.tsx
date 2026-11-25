import Link from 'next/link'
import { href } from '@/i18n/config'
import { fill } from '@/i18n'
import type { Page } from '@/payload-types'
import type { Site } from '@/lib/site'
import { bookingLink, resolveLink, whatsappHref } from '@/lib/links'
import { getPosts, getServices, getTeam, getTestimonials } from '@/lib/payload'
import { ButtonLink, CornerArrow, MoreLink } from '../ButtonLink'
import { PostCard, ServiceCard, TeamCard } from '../Cards'
import { Highlight } from '../Highlight'
import { Icon } from '../Icon'
import { MediaImage, hasMedia } from '../Media'
import { RichText } from '../RichText'
import { Section, SectionHeading } from '../Section'

type Block = NonNullable<Page['layout']>[number]
type Of<T extends Block['blockType']> = Extract<Block, { blockType: T }>

/** Tres tarjetas bajo la portada: "Quiénes somos", la tarjeta azul de agenda, "Casos de éxito". */
export function HighlightsBlock({ block, site }: { block: Of<'highlights'>; site: Site }) {
  if (!block.items?.length) return null
  const ctx = { settings: site.settings, locale: site.locale, whatsappMessage: site.whatsappMessage }
  return (
    <section className="py-12 sm:py-16">
      <div className="container-site grid gap-4 md:grid-cols-3">
        {block.items.map((item, i) => {
          const link = resolveLink(item.link, ctx)
          const accent = !!item.accent
          const body = (
            <>
              <div className="flex items-start justify-between gap-4">
                {item.label && <span className={accent ? 'pill-label-dark' : 'pill-label'}>{item.label}</span>}
                {link && <CornerArrow dark={accent} className="ml-auto" />}
              </div>
              <h2 className={`mt-5 font-display text-[1.35rem] leading-snug ${accent ? 'text-white' : 'text-ink'}`}>
                {item.title}
              </h2>
              {hasMedia(item.image) ? (
                <div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-[18px]">
                  <MediaImage media={item.image} size="card" sizes="(min-width: 768px) 33vw, 100vw" />
                </div>
              ) : (
                item.text && (
                  <p className={`mt-auto pt-10 text-[0.95rem] leading-relaxed ${accent ? 'text-white/80' : 'text-muted'}`}>
                    {item.text}
                  </p>
                )
              )}
            </>
          )
          const cls = `group flex min-h-[240px] flex-col rounded-[24px] p-6 transition duration-300 sm:p-7 md:min-h-[300px] ${
            accent ? 'on-dark bg-accent text-white hover:bg-accent-2' : 'bg-surface hover:bg-[#eceff5]'
          }`
          if (!link) return <div key={item.id ?? i} className={cls}>{body}</div>
          return link.external ? (
            <a key={item.id ?? i} href={link.href} target="_blank" rel="noopener noreferrer" className={cls}>
              {body}
            </a>
          ) : (
            <Link key={item.id ?? i} href={link.href} className={cls}>
              {body}
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export function StatsBlock({ block }: { block: Of<'stats'> }) {
  if (!block.items?.length) return null
  return (
    <section className="py-6 sm:py-10">
      <div className="container-site">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
          {block.items.map((item, i) => (
            <div key={item.id ?? i} className="flex flex-col border-t border-line pt-5">
              <dt className="order-2 mt-1 text-sm text-muted">{item.label}</dt>
              <dd className="font-display text-4xl text-ink sm:text-5xl">{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

export async function ServicesGridBlock({ block, site }: { block: Of<'servicesGrid'>; site: Site }) {
  const services = await getServices(site.locale, { onlyFeatured: !!block.onlyFeatured })
  const dark = block.theme === 'dark'
  return (
    <Section theme={block.theme}>
      <div className="container-site">
        <SectionHeading eyebrow={block.eyebrow} title={block.title} intro={block.intro} dark={dark} />
        {block.variant === 'chips' ? (
          <ul className="flex flex-wrap justify-center gap-2">
            {services.map((s) => (
              <li key={s.id}>
                <Link
                  href={href(site.locale, 'servicios', s.slug ?? '')}
                  className="group inline-flex items-center gap-2 rounded-full bg-white py-1.5 pr-4 pl-1.5 text-sm font-medium text-ink ring-1 ring-line hover:ring-accent"
                >
                  <span className="grid size-8 place-items-center rounded-full bg-accent-soft text-accent">
                    <Icon name={s.icon ?? 'shield'} className="size-4" />
                  </span>
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        ) : services.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <ServiceCard key={s.id} service={s} locale={site.locale} dict={site.dict} />
            ))}
            <Link
              href={href(site.locale, 'servicios')}
              className="group flex min-h-[220px] flex-col justify-between rounded-[24px] bg-ink p-6 text-white sm:p-7"
            >
              <span className="font-display text-xl leading-tight">{site.dict.common.allServices}</span>
              <CornerArrow dark className="self-end" />
            </Link>
          </div>
        ) : (
          <p className="text-center text-muted">{site.dict.services.empty}</p>
        )}
      </div>
    </Section>
  )
}

/** "Agenda una consultoría según tu necesidad": un acceso por departamento. */
export function DepartmentsBlock({
  block,
  site,
  all = false,
}: {
  block: Of<'departments'>
  site: Site
  all?: boolean
}) {
  const departments = (site.settings.departments ?? []).filter((d) => all || d.showOnHome !== false)
  if (!departments.length) return null
  const dark = block.theme === 'dark'
  return (
    <Section theme={block.theme} id="agendar">
      <div className="container-site">
        <SectionHeading eyebrow={block.eyebrow} title={block.title} intro={block.intro} dark={dark} />
        <div className={`grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 ${departments.length % 5 === 0 ? 'lg:grid-cols-5' : departments.length % 4 === 0 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
          {departments.map((d, i) => {
            const wa = whatsappHref(
              d.whatsappNumber || site.settings.whatsappNumber,
              fill(site.dict.whatsapp.department, { department: d.name }),
            )
            const link =
              block.action === 'whatsapp' && wa
                ? { href: wa, external: true }
                : bookingLink(site.settings, site.locale, d.bookingUrl)
            return (
              <a
                key={d.id ?? i}
                href={link.href}
                {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                data-track={`department-${block.action}`}
                className={`group flex min-h-[150px] flex-col justify-between rounded-[22px] p-5 transition duration-300 sm:p-6 ${
                  dark
                    ? 'bg-white/[0.06] hover:bg-white/[0.1]'
                    : `${block.theme === 'mist' ? 'bg-white' : 'bg-surface'} hover:bg-accent hover:text-white`
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="grid size-10 place-items-center rounded-full bg-accent text-white transition group-hover:bg-white group-hover:text-accent">
                    <Icon name={block.action === 'whatsapp' ? 'whatsapp' : (d.icon ?? 'shield')} className="size-5" />
                  </span>
                  <Icon name="arrowUpRight" className="size-4 opacity-50 transition group-hover:rotate-45 group-hover:opacity-100" />
                </div>
                <span>
                  <span className="block font-display text-lg leading-tight">{d.name}</span>
                  {d.description && <span className="mt-1 block text-sm opacity-70">{d.description}</span>}
                </span>
              </a>
            )
          })}
        </div>
      </div>
    </Section>
  )
}

export function ContentBlock({ block }: { block: Of<'content'> }) {
  const dark = block.theme === 'dark'
  return (
    <Section theme={block.theme}>
      <div className="container-site grid gap-8 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHeading eyebrow={block.eyebrow} title={block.title} dark={dark} align="left" className="!mb-0" />
        </div>
        <div className="lg:col-span-7 lg:pt-12">
          <RichText data={block.body} />
        </div>
      </div>
    </Section>
  )
}

export function ImageTextBlock({ block, site }: { block: Of<'imageText'>; site: Site }) {
  const dark = block.theme === 'dark'
  const link = resolveLink(block.link, {
    settings: site.settings,
    locale: site.locale,
    whatsappMessage: site.whatsappMessage,
  })
  const button = link && (
    <ButtonLink link={link} label={link.label || site.dict.common.learnMore} variant={dark ? 'light' : 'accent'} />
  )

  // Sin imagen: título a la izquierda y texto a la derecha.
  if (!hasMedia(block.image)) {
    return (
      <Section theme={block.theme}>
        <div className="container-site grid gap-8 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow={block.eyebrow} title={block.title} dark={dark} align="left" className="!mb-8" />
            {button && <div className="hidden lg:block">{button}</div>}
          </div>
          <div className="lg:col-span-7 lg:pt-12">
            <RichText data={block.body} />
            {button && <div className="mt-8 lg:hidden">{button}</div>}
          </div>
        </div>
      </Section>
    )
  }

  const imageLeft = block.imagePosition === 'left'
  return (
    <Section theme={block.theme}>
      <div className="container-site grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className={imageLeft ? 'lg:order-2' : ''}>
          <SectionHeading eyebrow={block.eyebrow} title={block.title} dark={dark} align="left" className="!mb-6" />
          <RichText data={block.body} />
          {button && <div className="mt-8">{button}</div>}
        </div>
        <div className={`relative aspect-[4/3] overflow-hidden rounded-[24px] ${imageLeft ? 'lg:order-1' : ''}`}>
          <MediaImage media={block.image} size="card" sizes="(min-width: 1024px) 50vw, 100vw" />
        </div>
      </div>
    </Section>
  )
}

export function FeaturesBlock({ block }: { block: Of<'features'> }) {
  const dark = block.theme === 'dark'
  if (!block.items?.length) return null
  const two = block.items.length === 2
  return (
    <Section theme={block.theme}>
      <div className="container-site">
        <SectionHeading eyebrow={block.eyebrow} title={block.title} intro={block.intro} dark={dark} />
        <div className={`grid gap-4 sm:grid-cols-2 ${two ? '' : 'lg:grid-cols-3'}`}>
          {block.items.map((item, i) => (
            <div
              key={item.id ?? i}
              className={`rounded-[24px] p-6 sm:p-8 ${dark ? 'bg-white/[0.06]' : block.theme === 'mist' ? 'bg-white' : 'bg-surface'}`}
            >
              <span className={`grid size-11 place-items-center rounded-full ${dark ? 'bg-white/10 text-white' : 'bg-accent-soft text-accent'}`}>
                <Icon name={item.icon ?? 'shield'} className="size-5" />
              </span>
              <h3 className={`mt-6 font-display text-xl leading-tight ${dark ? 'text-white' : 'text-ink'}`}>{item.title}</h3>
              {item.text && (
                <p className={`mt-3 text-[0.95rem] leading-relaxed ${dark ? 'text-white/70' : 'text-muted'}`}>{item.text}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}

export function TimelineBlock({ block }: { block: Of<'timeline'> }) {
  const dark = block.theme === 'dark'
  if (!block.items?.length) return null
  return (
    <Section theme={block.theme}>
      <div className="container-site">
        <SectionHeading eyebrow={block.eyebrow} title={block.title} dark={dark} />
        <ol className="mx-auto max-w-3xl space-y-8">
          {block.items.map((item, i) => (
            <li key={item.id ?? i} className={`grid gap-2 border-t pt-6 sm:grid-cols-[8rem_1fr] ${dark ? 'border-white/15' : 'border-line'}`}>
              <p className="font-display text-2xl text-accent">{item.year}</p>
              <div>
                <h3 className={`font-display text-lg ${dark ? 'text-white' : 'text-ink'}`}>{item.title}</h3>
                {item.text && <p className={`mt-2 leading-relaxed ${dark ? 'text-white/70' : 'text-muted'}`}>{item.text}</p>}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  )
}

export async function TeamGridBlock({ block, site }: { block: Of<'teamGrid'>; site: Site }) {
  const team = await getTeam(site.locale, block.limit ?? 4)
  const dark = block.theme === 'dark'
  return (
    <Section theme={block.theme}>
      <div className="container-site">
        <SectionHeading eyebrow={block.eyebrow} title={block.title} intro={block.intro} dark={dark} />
        {team.length ? (
          <div className="grid gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((p) => (
              <TeamCard key={p.id} person={p} dict={site.dict} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted">{site.dict.team.empty}</p>
        )}
        <div className="mt-12 flex justify-center">
          <MoreLink href={href(site.locale, 'equipo')} label={site.dict.common.viewAll} dark={dark} />
        </div>
      </div>
    </Section>
  )
}

export async function LatestPostsBlock({ block, site }: { block: Of<'latestPosts'>; site: Site }) {
  const posts = await getPosts(site.locale, { category: block.category ?? 'all', limit: block.limit ?? 3 })
  if (!posts.length) return null
  const dark = block.theme === 'dark'
  return (
    <Section theme={block.theme}>
      <div className="container-site">
        <SectionHeading eyebrow={block.eyebrow} title={block.title} dark={dark} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} locale={site.locale} dict={site.dict} />
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <MoreLink href={href(site.locale, 'blog')} label={site.dict.common.viewAll} dark={dark} />
        </div>
      </div>
    </Section>
  )
}

export async function TestimonialsBlock({ block, site }: { block: Of<'testimonials'>; site: Site }) {
  const chosen = (block.items ?? []).filter((t) => typeof t === 'object')
  const items = chosen.length ? chosen : await getTestimonials(site.locale)
  if (!items.length) return null
  const dark = block.theme === 'dark'
  return (
    <Section theme={block.theme}>
      <div className="container-site">
        <SectionHeading eyebrow={block.eyebrow} title={block.title} dark={dark} />
        <div className="grid gap-4 lg:grid-cols-2">
          {items.map((t) =>
            typeof t === 'object' ? (
              <figure
                key={t.id}
                className={`flex flex-col rounded-[24px] p-7 sm:p-10 ${
                  dark ? 'bg-white/[0.06]' : block.theme === 'mist' ? 'bg-white' : 'bg-surface'
                }`}
              >
                <Icon name="quote" className="size-8 text-accent" />
                <blockquote className={`mt-6 font-display text-lg leading-relaxed sm:text-xl ${dark ? 'text-white' : 'text-ink'}`}>
                  {t.quote}
                </blockquote>
                <figcaption className="mt-auto flex items-center gap-4 pt-8">
                  {hasMedia(t.logo) && (
                    <span className="relative size-12 overflow-hidden rounded-full bg-white ring-1 ring-line">
                      <MediaImage media={t.logo} size="thumb" sizes="48px" className="!object-contain p-1.5" />
                    </span>
                  )}
                  <span>
                    <span className={`block text-sm font-semibold ${dark ? 'text-white' : 'text-ink'}`}>{t.author}</span>
                    <span className={`block text-sm ${dark ? 'text-white/60' : 'text-muted'}`}>
                      {[t.position, t.company].filter(Boolean).join(' · ')}
                    </span>
                  </span>
                </figcaption>
              </figure>
            ) : null,
          )}
        </div>
      </div>
    </Section>
  )
}

export function FaqBlock({ block }: { block: Of<'faq'> }) {
  if (!block.items?.length) return null
  const dark = block.theme === 'dark'
  return (
    <Section theme={block.theme}>
      <div className="container-site grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHeading eyebrow={block.eyebrow} title={block.title} dark={dark} align="left" />
        </div>
        <div className="lg:col-span-8">
          <FaqList items={block.items} dark={dark} />
        </div>
      </div>
    </Section>
  )
}

export function FaqList({
  items,
  dark = false,
}: {
  items: { id?: string | null; question: string; answer: string }[]
  dark?: boolean
}) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <details key={item.id ?? i} className={`group rounded-[20px] px-6 py-5 ${dark ? 'bg-white/[0.06]' : 'bg-surface'}`}>
          <summary
            className={`flex cursor-pointer list-none items-start justify-between gap-6 font-display text-lg [&::-webkit-details-marker]:hidden ${dark ? 'text-white' : 'text-ink'}`}
          >
            {item.question}
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white text-ink transition group-open:rotate-45">
              <Icon name="plus" className="size-4" />
            </span>
          </summary>
          <p className={`mt-3 leading-relaxed ${dark ? 'text-white/70' : 'text-muted'}`}>{item.answer}</p>
        </details>
      ))}
    </div>
  )
}

export function CtaBlock({ block, site }: { block: Of<'cta'>; site: Site }) {
  const ctx = { settings: site.settings, locale: site.locale, whatsappMessage: site.whatsappMessage }
  const primary = resolveLink(block.primary, ctx)
  const secondary = resolveLink(block.secondary, ctx)
  return (
    <section className="py-3">
      <div className="frame on-dark relative overflow-hidden bg-accent text-white">
        <div className="container-site flex flex-col gap-10 py-16 sm:py-20 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="display-lg">
              <Highlight text={block.title} dark />
            </h2>
            {block.text && <p className="mt-5 text-base leading-relaxed text-white/80 sm:text-lg">{block.text}</p>}
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            {primary && <ButtonLink link={primary} label={primary.label || site.dict.nav.book} variant="light" />}
            {secondary && (
              <ButtonLink
                link={secondary}
                label={secondary.label || site.dict.common.writeWhatsApp}
                variant="glass"
                arrow={false}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
