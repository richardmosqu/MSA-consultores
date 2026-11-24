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
      <section className="bg-white py-16 sm:py-24">
        <div className="container-site">
          {services.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <ServiceCard key={s.id} service={s} locale={site.locale} dict={dict} />
              ))}
            </div>
          ) : (
            <p className="text-slate">{dict.services.empty}</p>
          )}
        </div>
      </section>
      <DepartmentsBlock
        site={site}
        block={{
          blockType: 'departments',
          title: dict.contact.optionBook,
          intro: dict.contact.optionBookText,
          action: 'booking',
          theme: 'dark',
        }}
      />
    </>
  )
}
