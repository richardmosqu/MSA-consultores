import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ButtonLink } from '@/components/ButtonLink'
import { FaqList } from '@/components/blocks/Blocks'
import { Icon } from '@/components/Icon'
import { PageHeader } from '@/components/PageHeader'
import { RichText } from '@/components/RichText'
import { ServicesBar, ServicesPager, ServicesSideNav } from '@/components/ServicesNav'
import { WhatsAppMessage } from '@/components/WhatsApp'
import { fill, href } from '@/i18n'
import { bookingLink, whatsappHref } from '@/lib/links'
import { getServiceBySlug } from '@/lib/payload'
import { pageMetadata } from '@/lib/seo'
import { getSite } from '@/lib/site'

export const generateStaticParams = async () => []

export async function generateMetadata({ params }: PageProps<'/[locale]/servicios/[slug]'>): Promise<Metadata> {
  const { locale, slug } = await params
  const site = await getSite(locale)
  const service = await getServiceBySlug(slug, site.locale)
  if (!service) return {}
  return pageMetadata({
    locale: site.locale,
    route: 'servicios',
    rest: [slug],
    title: service.title,
    description: service.summary,
    meta: service.meta,
  })
}

export default async function ServicePage({ params }: PageProps<'/[locale]/servicios/[slug]'>) {
  const { locale, slug } = await params
  const site = await getSite(locale)
  const service = await getServiceBySlug(slug, site.locale)
  if (!service) notFound()
  const { dict, settings } = site

  const waMessage = service.whatsappMessage || fill(dict.whatsapp.service, { service: service.title })
  const wa = whatsappHref(settings.whatsappNumber, waMessage)
  const booking = bookingLink(settings, site.locale, service.bookingUrl)
  const current = href(site.locale, 'servicios', service.slug ?? slug)
  const hasContent = Boolean(
    (service.body as { root?: { children?: unknown[] } } | null)?.root?.children?.length || service.faq?.length,
  )
  const crumbs = [
    { href: `/${site.locale}`, label: dict.common.home },
    { href: href(site.locale, 'servicios'), label: dict.nav.services },
    { label: service.title },
  ]

  return (
    <>
      <WhatsAppMessage message={waMessage} />
      <PageHeader breadcrumbs={crumbs} eyebrow={dict.common.serviceAreas} title={service.title} intro={service.summary}>
        <div className="mt-9 flex flex-wrap items-center gap-3">
          <ButtonLink link={booking} label={dict.common.bookThisService} />
          {wa && (
            <ButtonLink
              link={{ href: wa, external: true, kind: 'whatsapp' }}
              label={dict.common.writeWhatsApp}
              variant="glass"
            />
          )}
        </div>
      </PageHeader>

      {/* En móvil y tablet: barra de áreas deslizable; en escritorio, la lista lateral. */}
      <div className="lg:hidden">
        <ServicesBar links={site.serviceLinks} current={current} label={dict.common.serviceAreas} />
      </div>

      <section className="py-10 sm:py-16">
        <div className="container-site grid gap-10 lg:grid-cols-12">
          <aside className="hidden lg:col-span-4 lg:block xl:col-span-3">
            <div className="sticky top-28">
              <ServicesSideNav
                links={site.serviceLinks}
                current={current}
                title={dict.common.serviceAreas}
                allHref={href(site.locale, 'servicios')}
                allLabel={dict.common.allServices}
              />
            </div>
          </aside>

          {hasContent && (
            <div className="lg:col-span-8 xl:col-span-5 xl:pt-4">
              <RichText data={service.body} />
              {service.faq && service.faq.length > 0 && (
                <div className="mt-14">
                  <h2 className="display-md mb-6 text-ink">{dict.common.faq}</h2>
                  <FaqList items={service.faq} />
                </div>
              )}
            </div>
          )}

          <div
            className={`space-y-4 ${
              hasContent ? 'lg:col-span-8 lg:col-start-5 xl:col-span-4 xl:col-start-auto' : 'lg:col-span-8 xl:col-span-9'
            }`}
          >
            {service.features && service.features.length > 0 && (
              <div className="rounded-card bg-surface p-7 sm:p-8">
                <p className="pill-label">{dict.common.whatWeDo}</p>
                <ul className="mt-6 space-y-4">
                  {service.features.map((f, i) => (
                    <li key={f.id ?? i} className="flex gap-3 text-[0.95rem] text-ink">
                      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-dot bg-accent text-white">
                        <Icon name="chevron" className="size-3" strokeWidth={2.4} />
                      </span>
                      {f.text}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="on-dark rounded-card bg-accent p-7 text-white sm:p-8">
              <p className="font-display text-2xl leading-tight">{dict.common.bookThisService}</p>
              <p className="mt-3 text-sm leading-relaxed text-white/80">{dict.contact.optionBookText}</p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <ButtonLink link={booking} label={dict.nav.book} variant="light" />
                {wa && (
                  <ButtonLink link={{ href: wa, external: true, kind: 'whatsapp' }} label="WhatsApp" variant="glass" />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="container-site mt-14">
          <ServicesPager
            links={site.serviceLinks}
            current={current}
            prevLabel={dict.common.prevArea}
            nextLabel={dict.common.nextArea}
          />
        </div>
      </section>
    </>
  )
}
