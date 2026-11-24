import { href } from '@/i18n/config'
import { fill } from '@/i18n'
import type { Page } from '@/payload-types'
import type { Site } from '@/lib/site'
import { bookingLink, resolveLink, whatsappHref } from '@/lib/links'
import { getPosts, getServices, getTeam, getTestimonials } from '@/lib/payload'
import Link from 'next/link'
import { ButtonLink, MoreLink } from '../ButtonLink'
import { PostCard, ServiceCard, TeamCard } from '../Cards'
import { Dots, Shards } from '../Decor'
import { Highlight } from '../Highlight'
import { Icon } from '../Icon'
import { MediaImage, hasMedia } from '../Media'
import { RichText } from '../RichText'
import { Section, SectionHeading } from '../Section'

type Block = NonNullable<Page['layout']>[number]
type Of<T extends Block['blockType']> = Extract<Block, { blockType: T }>

export function StatsBlock({ block }: { block: Of<'stats'> }) {
  if (!block.items?.length) return null
  return (
    <section className="relative z-10 -mt-12 sm:-mt-16">
      <div className="container-site">
        <dl className="grid grid-cols-2 overflow-hidden rounded-2xl bg-white shadow-[0_30px_60px_-30px_rgba(3,8,35,0.5)] ring-1 ring-line lg:grid-cols-4">
          {block.items.map((item, i) => (
            <div
              key={item.id ?? i}
              className="flex flex-col border-line p-6 sm:p-8 [&:not(:last-child)]:border-r max-lg:[&:nth-child(2)]:border-r-0 max-lg:[&:nth-child(-n+2)]:border-b"
            >
              <dt className="order-2 mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate">{item.label}</dt>
              <dd className="font-display text-4xl text-electric sm:text-5xl">{item.value}</dd>
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
  if (block.variant === 'chips') {
    return (
      <Section theme={block.theme}>
        {dark && <Shards />}
        <div className="container-site relative">
          <SectionHeading eyebrow={block.eyebrow} title={block.title} intro={block.intro} dark={dark} />
          <ul className="flex flex-wrap gap-3">
            {services.map((s) => (
              <li key={s.id}>
                <Link
                  href={href(site.locale, 'servicios', s.slug ?? '')}
                  className={`inline-flex items-center gap-3 rounded-full border px-5 py-3 text-sm font-black uppercase tracking-wide transition ${
                    dark
                      ? 'border-white/20 text-white hover:border-sky hover:bg-sky/10'
                      : 'border-navy/15 text-navy hover:border-electric hover:text-electric'
                  }`}
                >
                  <Icon name={s.icon ?? 'shield'} className="size-5" />
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>
    )
  }
  return (
    <Section theme={block.theme}>
      {dark && <Shards />}
      <div className="container-site relative">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading eyebrow={block.eyebrow} title={block.title} intro={block.intro} dark={dark} />
          <div className="mb-10 shrink-0 sm:mb-14">
            <MoreLink href={href(site.locale, 'servicios')} label={site.dict.common.allServices} dark={dark} />
          </div>
        </div>
        {services.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <ServiceCard key={s.id} service={s} locale={site.locale} dict={site.dict} dark={dark} />
            ))}
          </div>
        ) : (
          <p className={dark ? 'text-haze' : 'text-slate'}>{site.dict.services.empty}</p>
        )}
      </div>
    </Section>
  )
}

/** "Agenda una consultoría según tu necesidad": un botón por departamento. */
export function DepartmentsBlock({ block, site }: { block: Of<'departments'>; site: Site }) {
  const departments = (site.settings.departments ?? []).filter((d) => d.showOnHome !== false)
  if (!departments.length) return null
  const dark = block.theme === 'dark'
  return (
    <Section theme={block.theme} id="agendar">
      {dark && <Shards />}
      <div className="container-site relative">
        <SectionHeading eyebrow={block.eyebrow} title={block.title} intro={block.intro} dark={dark} />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
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
                className={`group relative flex flex-col overflow-hidden rounded-2xl p-5 transition duration-300 hover:-translate-y-1 sm:p-6 ${
                  dark
                    ? 'bg-white/[0.05] ring-1 ring-white/10 hover:bg-electric hover:ring-electric'
                    : 'bg-navy text-white hover:bg-electric'
                }`}
              >
                <Icon name={d.icon ?? 'shield'} className="size-8 text-sky transition group-hover:text-white" />
                <span className="mt-5 text-lg font-black uppercase leading-tight text-white sm:mt-6 sm:text-xl">
                  {d.shortName || d.name}
                </span>
                {d.description && <span className="mt-2 text-sm leading-snug text-haze group-hover:text-white/90">{d.description}</span>}
                <span className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white">
                  <Icon name={block.action === 'whatsapp' ? 'whatsapp' : 'calendar'} className="size-4" />
                  {block.action === 'whatsapp' ? 'WhatsApp' : site.dict.nav.book}
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
      {dark && <Shards />}
      <div className="container-site relative grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading eyebrow={block.eyebrow} title={block.title} dark={dark} />
        </div>
        <div className="lg:col-span-7">
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
  const imageLeft = block.imagePosition === 'left'
  return (
    <Section theme={block.theme}>
      <div className="container-site relative grid items-center gap-12 lg:grid-cols-2">
        <div className={imageLeft ? 'lg:order-2' : ''}>
          <SectionHeading eyebrow={block.eyebrow} title={block.title} dark={dark} />
          <RichText data={block.body} className="-mt-4" />
          {link && (
            <div className="mt-8">
              <ButtonLink link={link} label={link.label || site.dict.common.learnMore} variant="primary" />
            </div>
          )}
        </div>
        <div className={`relative ${imageLeft ? 'lg:order-1' : ''}`}>
          <div className="absolute inset-0 translate-x-2 translate-y-3 rounded-3xl bg-electric/15 sm:translate-x-4 sm:translate-y-4" aria-hidden />
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-gradient-to-br from-navy via-navy-2 to-electric">
            {hasMedia(block.image) ? (
              <MediaImage media={block.image} size="card" sizes="(min-width: 1024px) 50vw, 100vw" />
            ) : (
              <>
                <Shards />
                <Dots className="inset-0 h-full w-full" />
              </>
            )}
          </div>
        </div>
      </div>
    </Section>
  )
}

export function FeaturesBlock({ block }: { block: Of<'features'> }) {
  const dark = block.theme === 'dark'
  if (!block.items?.length) return null
  return (
    <Section theme={block.theme}>
      {dark && <Shards />}
      <div className="container-site relative">
        <SectionHeading eyebrow={block.eyebrow} title={block.title} intro={block.intro} dark={dark} />
        <div className="grid gap-px overflow-hidden rounded-2xl bg-current/10 sm:grid-cols-2 lg:grid-cols-3">
          {block.items.map((item, i) => (
            <div key={item.id ?? i} className={`p-7 sm:p-8 ${dark ? 'bg-navy' : 'bg-white'}`}>
              <Icon name={item.icon ?? 'shield'} className={`size-9 ${dark ? 'text-sky' : 'text-electric'}`} />
              <h3 className={`mt-5 text-lg font-black uppercase leading-tight ${dark ? 'text-white' : 'text-ink'}`}>
                {item.title}
              </h3>
              {item.text && (
                <p className={`mt-3 text-sm leading-relaxed ${dark ? 'text-haze' : 'text-slate'}`}>{item.text}</p>
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
      <div className="container-site relative">
        <SectionHeading eyebrow={block.eyebrow} title={block.title} dark={dark} />
        <ol className={`relative space-y-10 border-l-2 pl-8 ${dark ? 'border-white/15' : 'border-line'}`}>
          {block.items.map((item, i) => (
            <li key={item.id ?? i} className="relative">
              <span className="absolute top-1.5 -left-[2.55rem] size-4 rounded-full border-4 border-electric bg-white" />
              <p className="font-display text-3xl text-electric">{item.year}</p>
              <h3 className={`mt-1 text-lg font-black uppercase ${dark ? 'text-white' : 'text-ink'}`}>{item.title}</h3>
              {item.text && <p className={`mt-2 max-w-2xl leading-relaxed ${dark ? 'text-haze' : 'text-slate'}`}>{item.text}</p>}
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
      {dark && <Shards />}
      <div className="container-site relative">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <span className="badge mb-5">{site.dict.team.badge}</span>
            <SectionHeading eyebrow={block.eyebrow} title={block.title} intro={block.intro} dark={dark} />
          </div>
          <div className="mb-10 shrink-0 sm:mb-14">
            <MoreLink href={href(site.locale, 'equipo')} label={site.dict.common.viewAll} dark={dark} />
          </div>
        </div>
        {team.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((p) => (
              <TeamCard key={p.id} person={p} dict={site.dict} />
            ))}
          </div>
        ) : (
          <p className={dark ? 'text-haze' : 'text-slate'}>{site.dict.team.empty}</p>
        )}
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
      <div className="container-site relative">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading eyebrow={block.eyebrow} title={block.title} dark={dark} />
          <div className="mb-10 shrink-0 sm:mb-14">
            <MoreLink href={href(site.locale, 'blog')} label={site.dict.common.viewAll} dark={dark} />
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} locale={site.locale} dict={site.dict} />
          ))}
        </div>
      </div>
    </Section>
  )
}

export async function TestimonialsBlock({ block, site }: { block: Of<'testimonials'>; site: Site }) {
  const chosen = (block.items ?? []).filter((t) => typeof t === 'object')
  const items = chosen.length ? chosen : await getTestimonials(site.locale)
  if (!items.length) return null
  const dark = block.theme !== 'light'
  return (
    <Section theme={dark ? 'dark' : 'light'}>
      {dark && <Shards />}
      <div className="container-site relative">
        <SectionHeading eyebrow={block.eyebrow} title={block.title} dark={dark} />
        <div className="grid gap-6 lg:grid-cols-2">
          {items.map((t) =>
            typeof t === 'object' ? (
              <figure
                key={t.id}
                className={`relative flex flex-col rounded-2xl p-8 sm:p-10 ${dark ? 'bg-white/[0.05] ring-1 ring-white/10' : 'bg-mist'}`}
              >
                <Icon name="quote" className="size-10 text-electric" />
                <blockquote className={`mt-5 text-lg leading-relaxed sm:text-xl ${dark ? 'text-white' : 'text-ink'}`}>
                  {t.quote}
                </blockquote>
                <figcaption className="mt-auto flex items-center gap-4 pt-8">
                  {hasMedia(t.logo) && (
                    <span className="relative size-12 overflow-hidden rounded-full bg-white">
                      <MediaImage media={t.logo} size="thumb" sizes="48px" className="!object-contain p-1.5" />
                    </span>
                  )}
                  <span>
                    <span className={`block font-extrabold ${dark ? 'text-white' : 'text-ink'}`}>{t.author}</span>
                    <span className={`block text-sm ${dark ? 'text-sky' : 'text-electric'}`}>
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
      <div className="container-site relative grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHeading eyebrow={block.eyebrow} title={block.title} dark={dark} />
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
    <div className={`divide-y rounded-2xl border ${dark ? 'divide-white/10 border-white/10' : 'divide-line border-line'}`}>
      {items.map((item, i) => (
        <details key={item.id ?? i} className="group p-6">
          <summary
            className={`flex cursor-pointer list-none items-start justify-between gap-6 text-base font-bold [&::-webkit-details-marker]:hidden ${dark ? 'text-white' : 'text-ink'}`}
          >
            {item.question}
            <Icon name="plus" className="mt-0.5 size-5 shrink-0 text-electric transition group-open:rotate-45" />
          </summary>
          <p className={`mt-4 leading-relaxed ${dark ? 'text-haze' : 'text-slate'}`}>{item.answer}</p>
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
    <section className="bg-white py-16 sm:py-24">
      <div className="container-site">
        <div className="surface-dark on-dark relative overflow-hidden rounded-3xl px-6 py-14 sm:px-14 sm:py-20">
          <Shards />
          <Dots className="top-0 left-0 h-40 w-60" />
          <div className="relative max-w-3xl">
            <h2 className="headline-lg text-white">
              <Highlight text={block.title} className="text-sky" />
            </h2>
            {block.text && <p className="mt-5 text-lg leading-relaxed text-haze">{block.text}</p>}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              {primary && <ButtonLink link={primary} label={primary.label || site.dict.nav.book} />}
              {secondary && (
                <ButtonLink
                  link={secondary}
                  label={secondary.label || site.dict.common.writeWhatsApp}
                  variant={secondary.kind === 'whatsapp' ? 'whatsapp' : 'ghost-dark'}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
