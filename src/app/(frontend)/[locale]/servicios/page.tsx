import type { Metadata } from 'next'
import { ServiceCard } from '@/components/Cards'
import { DepartmentsBlock } from '@/components/blocks/Blocks'
import { PageHeader } from '@/components/PageHeader'
import { ServicesBar } from '@/components/ServicesNav'
import { getServices } from '@/lib/payload'
import { pageMetadata } from '@/lib/seo'
import { getSite } from '@/lib/site'

export async function generateMetadata({ params }: PageProps<'/[locale]/servicios'>): Promise<Metadata> {
  const site = await getSite((await params).locale)
  return pageMetadata({
    locale: site.locale,
    route: 'servicios',
    title: site.dict.nav.services,
    description: site.dict.services.intro,
  })
}

export default async function ServicesPage({ params }: PageProps<'/[locale]/servicios'>) {
  const site = await getSite((await params).locale)
  const services = await getServices(site.locale)
  const { dict } = site

  return (
    <>
      <PageHeader
        breadcrumbs={[{ href: `/${site.locale}`, label: dict.common.home }, { label: dict.nav.services }]}
        eyebrow={dict.services.eyebrow}
        title={dict.services.title}
        intro={dict.services.intro}
      />
      <ServicesBar links={site.serviceLinks} label={dict.common.serviceAreas} />
      <section className="pt-6 pb-16 sm:pb-20">
        <div className="container-site">
          {services.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <ServiceCard key={s.id} service={s} locale={site.locale} dict={dict} />
              ))}
            </div>
          ) : (
            <p className="text-muted">{dict.services.empty}</p>
          )}
        </div>
      </section>
      <DepartmentsBlock
        site={site}
        block={{
          blockType: 'departments',
          eyebrow: dict.contact.optionBook,
          title: dict.contact.optionBookText,
          action: 'booking',
          theme: 'mist',
        }}
      />
    </>
  )
}
