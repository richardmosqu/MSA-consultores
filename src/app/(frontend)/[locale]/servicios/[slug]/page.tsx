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
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <ButtonLink link={booking} label={dict.common.bookThisService} />
          {wa && (
            <ButtonLink link={{ href: wa, external: true, kind: 'whatsapp' }} label={dict.common.writeWhatsApp} variant="whatsapp" />
          )}
        </div>
      </PageHeader>

      {/* En móvil y tablet: barra de áreas deslizable; en escritorio, la lista lateral. */}
      <div className="lg:hidden">
        <ServicesBar links={site.serviceLinks} current={current} label={dict.common.serviceAreas} />
      </div>

      <section className="bg-white py-14 sm:py-20">
        <div className="container-site grid gap-12 lg:grid-cols-12">
          <aside className="hidden lg:col-span-4 lg:block xl:col-span-3">
            <div className="sticky top-28 space-y-5">
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
            <div className="lg:col-span-8 xl:col-span-5">
              <RichText data={service.body} />
              {service.faq && service.faq.length > 0 && (
                <div className="mt-14">
                  <h2 className="headline-md mb-6 text-ink">{dict.common.faq}</h2>
                  <FaqList items={service.faq} />
                </div>
              )}
            </div>
          )}
          <div className={hasContent ? 'lg:col-span-8 lg:col-start-5 xl:col-span-4 xl:col-start-auto' : 'lg:col-span-8 xl:col-span-6'}>
            {service.features && service.features.length > 0 && (
              <div className="rounded-2xl bg-mist p-7 sm:p-9">
                <p className="eyebrow eyebrow-start mb-5 text-electric">{dict.common.whatWeDo}</p>
                <ul className="space-y-4">
                  {service.features.map((f, i) => (
                    <li key={f.id ?? i} className="flex gap-3 text-[0.95rem] font-semibold text-ink">
                      <Icon name="compliance" className="size-5 shrink-0 text-electric" />
                      {f.text}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="surface-dark on-dark relative mt-6 overflow-hidden rounded-2xl p-7">
              <p className="text-lg font-black uppercase leading-tight text-white">{dict.common.bookThisService}</p>
              <p className="mt-2 text-sm leading-relaxed text-haze">{dict.contact.optionBookText}</p>
              <div className="mt-6 flex flex-col gap-2">
                <ButtonLink link={booking} label={dict.nav.book} />
                {wa && (
                  <ButtonLink link={{ href: wa, external: true, kind: 'whatsapp' }} label="WhatsApp" variant="whatsapp" />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="container-site mt-16">
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
