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

      <section className="py-12 sm:py-16">
        <div className="container-site grid gap-4 md:grid-cols-3">
          {options.map((o, i) => {
            const accent = i === 0
            return (
              <div
                key={o.title}
                className={`flex min-h-[260px] flex-col rounded-[24px] p-6 sm:p-7 ${accent ? 'on-dark bg-accent text-white' : 'bg-surface'}`}
              >
                <span className={`grid size-11 place-items-center rounded-full ${accent ? 'bg-white text-accent' : 'bg-accent text-white'}`}>
                  <Icon name={o.icon} className="size-5" />
                </span>
                <h2 className={`mt-6 font-display text-xl leading-tight ${accent ? 'text-white' : 'text-ink'}`}>{o.title}</h2>
                <p className={`mt-2 mb-7 text-sm leading-relaxed ${accent ? 'text-white/80' : 'text-muted'}`}>{o.text}</p>
                <ButtonLink
                  link={o.link}
                  label={o.label}
                  variant={accent ? 'light' : o.link.kind === 'whatsapp' ? 'whatsapp' : 'outline'}
                  className="mt-auto"
                />
              </div>
            )
          })}
        </div>
      </section>

      <DepartmentsBlock
        site={site}
        all
        block={{
          blockType: 'departments',
          eyebrow: c.departmentsTitle,
          title: c.departmentsIntro,
          action: 'whatsapp',
          theme: 'mist',
        }}
      />

      <section id="mensaje" className="scroll-mt-28 py-16 sm:py-24">
        <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <p className="pill-label">{c.optionTalk}</p>
            <h2 className="display-lg mt-5 mb-10 text-ink">{c.formTitle}</h2>
            <ContactForm
              locale={site.locale}
              labels={c.form}
              services={services.map((s) => s.title)}
              privacyHref={href(site.locale, 'privacidad')}
            />
          </div>

          <aside className="space-y-4 lg:col-span-5">
            <div className="on-dark rounded-[24px] bg-ink p-7 text-white sm:p-8">
              <p className="pill-label-dark">{c.infoTitle}</p>
              <p className="mt-5 font-display text-xl leading-snug">{settings.officeName || c.mainOffice}</p>
              <dl className="mt-6 space-y-4 text-sm text-white/75">
                {settings.address && (
                  <div className="flex gap-3">
                    <Icon name="pin" className="mt-0.5 size-4.5 shrink-0 text-white" />
                    <div>
                      <dt className="sr-only">{c.address}</dt>
                      <dd className="whitespace-pre-line leading-relaxed">{settings.address}</dd>
                      {settings.mapsUrl && (
                        <a
                          href={settings.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-block font-semibold text-white underline underline-offset-4"
                        >
                          {c.howToArrive}
                        </a>
                      )}
                    </div>
                  </div>
                )}
                {settings.phones && settings.phones.length > 0 && (
                  <div className="flex gap-3">
                    <Icon name="phone" className="mt-0.5 size-4.5 shrink-0 text-white" />
                    <div>
                      <dt className="sr-only">{c.phone}</dt>
                      {settings.phones.map((p) => (
                        <dd key={p.id ?? p.number}>
                          <a href={`tel:${p.number.replace(/[^\d+]/g, '')}`} className="hover:text-white">
                            {p.number}
                          </a>
                        </dd>
                      ))}
                    </div>
                  </div>
                )}
                {settings.email && (
                  <div className="flex gap-3">
                    <Icon name="mail" className="mt-0.5 size-4.5 shrink-0 text-white" />
                    <div>
                      <dt className="sr-only">{c.email}</dt>
                      <dd>
                        <a href={`mailto:${settings.email}`} className="[overflow-wrap:anywhere] hover:text-white">
                          {settings.email}
                        </a>
                      </dd>
                    </div>
                  </div>
                )}
                {settings.hours && (
                  <div className="flex gap-3">
                    <Icon name="clock" className="mt-0.5 size-4.5 shrink-0 text-white" />
                    <div>
                      <dt className="sr-only">{c.hours}</dt>
                      <dd>{settings.hours}</dd>
                    </div>
                  </div>
                )}
              </dl>
            </div>

            {settings.offices && settings.offices.length > 0 && (
              <div className="rounded-[24px] bg-surface p-7 sm:p-8">
                <p className="pill-label">{c.regionalTitle}</p>
                <ul className="mt-6 divide-y divide-line">
                  {settings.offices.map((o, i) => (
                    <li key={o.id ?? i} className="py-4 first:pt-0 last:pb-0">
                      <p className="flex flex-wrap items-center gap-2 font-display text-lg text-ink">
                        {o.name}
                        {o.status === 'soon' && (
                          <span className="rounded-full bg-accent-soft px-2.5 py-0.5 font-sans text-[0.65rem] font-semibold text-accent uppercase">
                            {c.soon}
                          </span>
                        )}
                        {o.status === 'international' && (
                          <span className="rounded-full bg-white px-2.5 py-0.5 font-sans text-[0.65rem] font-semibold text-muted uppercase ring-1 ring-line">
                            {c.international}
                          </span>
                        )}
                      </p>
                      {o.text && <p className="mt-1.5 text-sm leading-relaxed text-muted">{o.text}</p>}
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
