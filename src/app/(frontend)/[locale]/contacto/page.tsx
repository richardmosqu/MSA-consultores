import type { Metadata } from 'next'
import { ButtonLink } from '@/components/ButtonLink'
import { DepartmentsBlock } from '@/components/blocks/Blocks'
import { Icon } from '@/components/Icon'
import { PageHeader } from '@/components/PageHeader'
import { href } from '@/i18n'
import { whatsappHref } from '@/lib/links'
import { getServices } from '@/lib/payload'
import { pageMetadata } from '@/lib/seo'
import { getSite } from '@/lib/site'
import { ContactForm } from './ContactForm'

export async function generateMetadata({ params }: PageProps<'/[locale]/contacto'>): Promise<Metadata> {
  const site = await getSite((await params).locale)
  return pageMetadata({ locale: site.locale, route: 'contacto', title: site.dict.nav.contact, description: site.dict.contact.intro })
}

export default async function ContactPage({ params }: PageProps<'/[locale]/contacto'>) {
  const site = await getSite((await params).locale)
  const { dict, settings, booking } = site
  const c = dict.contact
  const services = await getServices(site.locale)
  const wa = whatsappHref(settings.whatsappNumber, site.whatsappMessage)

  const options = [
    { icon: 'calendar', title: c.optionBook, text: c.optionBookText, link: booking, label: dict.nav.book },
    {
      icon: 'talent',
      title: c.optionTalk,
      text: c.optionTalkText,
      link: { href: '#mensaje', external: false, kind: 'internal' as const },
      label: c.formTitle,
    },
    ...(wa
      ? [
          {
            icon: 'whatsapp',
            title: c.optionWhatsApp,
            text: c.optionWhatsAppText,
            link: { href: wa, external: true, kind: 'whatsapp' as const },
            label: 'WhatsApp',
          },
        ]
      : []),
  ]

  return (
    <>
      <PageHeader
        breadcrumbs={[{ href: `/${site.locale}`, label: dict.common.home }, { label: dict.nav.contact }]}
        eyebrow={c.eyebrow}
        title={c.title}
        intro={c.intro}
      />

      <section className="relative z-10 -mt-10">
        <div className="container-site grid gap-4 md:grid-cols-3">
          {options.map((o) => (
            <div key={o.title} className="flex flex-col rounded-2xl bg-white p-7 shadow-[0_30px_60px_-35px_rgba(3,8,35,0.55)] ring-1 ring-line">
              <Icon name={o.icon} className="size-8 text-electric" />
              <h2 className="mt-5 text-lg font-black uppercase leading-tight text-ink">{o.title}</h2>
              <p className="mt-2 mb-6 text-sm leading-relaxed text-slate">{o.text}</p>
              <ButtonLink
                link={o.link}
                label={o.label}
                variant={o.link.kind === 'whatsapp' ? 'whatsapp' : o.link.kind === 'booking' ? 'primary' : 'ghost-light'}
                className="mt-auto"
              />
            </div>
          ))}
        </div>
      </section>

      <DepartmentsBlock
        site={site}
        block={{ blockType: 'departments', title: c.departmentsTitle, intro: c.departmentsIntro, action: 'whatsapp', theme: 'light' }}
      />

      <section id="mensaje" className="scroll-mt-24 bg-mist py-16 sm:py-24">
        <div className="container-site grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="headline-md mb-8 text-ink">{c.formTitle}</h2>
            <ContactForm
              locale={site.locale}
              labels={c.form}
              services={services.map((s) => s.title)}
              privacyHref={href(site.locale, 'privacidad')}
            />
          </div>

          <aside className="space-y-8 lg:col-span-5">
            <div className="rounded-2xl bg-navy p-8 text-white">
              <p className="eyebrow eyebrow-start mb-5 text-sky">{settings.officeName || c.mainOffice}</p>
              <dl className="space-y-5 text-sm">
                {settings.address && (
                  <div className="flex gap-3">
                    <Icon name="pin" className="size-5 shrink-0 text-sky" />
                    <div>
                      <dt className="sr-only">{c.address}</dt>
                      <dd className="whitespace-pre-line leading-relaxed">{settings.address}</dd>
                      {settings.mapsUrl && (
                        <a href={settings.mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block font-semibold text-sky underline underline-offset-4">
                          {c.howToArrive}
                        </a>
                      )}
                    </div>
                  </div>
                )}
                {settings.phones && settings.phones.length > 0 && (
                  <div className="flex gap-3">
                    <Icon name="phone" className="size-5 shrink-0 text-sky" />
                    <div>
                      <dt className="sr-only">{c.phone}</dt>
                      {settings.phones.map((p) => (
                        <dd key={p.id ?? p.number}>
                          <a href={`tel:${p.number.replace(/[^\d+]/g, '')}`} className="hover:text-sky">
                            {p.number}
                          </a>
                        </dd>
                      ))}
                    </div>
                  </div>
                )}
                {settings.email && (
                  <div className="flex gap-3">
                    <Icon name="mail" className="size-5 shrink-0 text-sky" />
                    <div>
                      <dt className="sr-only">{c.email}</dt>
                      <dd>
                        <a href={`mailto:${settings.email}`} className="break-all hover:text-sky">
                          {settings.email}
                        </a>
                      </dd>
                    </div>
                  </div>
                )}
                {settings.hours && (
                  <div className="flex gap-3">
                    <Icon name="clock" className="size-5 shrink-0 text-sky" />
                    <div>
                      <dt className="sr-only">{c.hours}</dt>
                      <dd>{settings.hours}</dd>
                    </div>
                  </div>
                )}
              </dl>
            </div>

            {settings.offices && settings.offices.length > 0 && (
              <div>
                <p className="eyebrow eyebrow-start mb-5 text-electric">{c.regionalTitle}</p>
                <ul className="space-y-4">
                  {settings.offices.map((o, i) => (
                    <li key={o.id ?? i} className="rounded-2xl border border-line bg-white p-6">
                      <p className="flex flex-wrap items-center gap-2 font-black uppercase text-ink">
                        {o.name}
                        {o.status === 'soon' && <span className="badge !text-[0.6rem]">{c.soon}</span>}
                        {o.status === 'international' && (
                          <span className="rounded-full bg-navy px-2.5 py-0.5 text-[0.6rem] font-bold tracking-widest text-white">
                            {c.international}
                          </span>
                        )}
                      </p>
                      {o.text && <p className="mt-2 text-sm leading-relaxed text-slate">{o.text}</p>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </section>
    </>
  )
}
