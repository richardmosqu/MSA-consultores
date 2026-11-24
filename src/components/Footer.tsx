import Link from 'next/link'
import { href, type Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n'
import type { SiteSetting } from '@/payload-types'
import type { ServiceLink } from '@/lib/site'
import { CookiePreferencesButton } from './CookieBanner'
import { Dots } from './Decor'
import { Icon } from './Icon'
import { Logo } from './Logo'

export function Footer({
  locale,
  dict,
  settings,
  nav,
  services,
}: {
  locale: Locale
  dict: Dictionary
  settings: SiteSetting
  nav: { href: string; label: string }[]
  services: ServiceLink[]
}) {
  const socials = (['instagram', 'linkedin', 'facebook', 'tiktok', 'youtube'] as const).filter(
    (k) => settings[k],
  )
  const year = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden bg-ink text-haze">
      <Dots className="top-0 left-0 h-48 w-72" />
      <div className="container-site relative grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-3">
          <Logo className="text-lg text-white" />
          <p className="eyebrow eyebrow-start mt-6 text-sky">{dict.brand.tagline}</p>
          {socials.length > 0 && (
            <div className="mt-8">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/60">{dict.footer.followUs}</p>
              <div className="flex gap-2">
                {socials.map((k) => (
                  <a
                    key={k}
                    href={settings[k] as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={k}
                    className="grid size-10 place-items-center rounded-full border border-white/15 text-white transition hover:border-sky hover:text-sky"
                  >
                    <Icon name={k} className="size-4.5" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <nav className="md:col-span-3" aria-label={dict.common.serviceAreas}>
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/60">{dict.nav.services}</p>
          <ul className="space-y-2.5 text-sm">
            {services.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="md:col-span-2" aria-label={dict.footer.sections}>
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/60">{dict.footer.sections}</p>
          <ul className="space-y-2.5 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <address className="space-y-3 text-sm not-italic md:col-span-4">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/60">{dict.nav.contact}</p>
          {settings.address && (
            <p className="flex gap-3">
              <Icon name="pin" className="mt-0.5 size-5 shrink-0 text-sky" />
              <span className="whitespace-pre-line">{settings.address}</span>
            </p>
          )}
          {settings.phones?.map((p) => (
            <p key={p.id ?? p.number} className="flex gap-3">
              <Icon name="phone" className="size-5 shrink-0 text-sky" />
              <a href={`tel:${p.number.replace(/[^\d+]/g, '')}`} className="hover:text-white">
                {p.number}
              </a>
            </p>
          ))}
          {settings.email && (
            <p className="flex gap-3">
              <Icon name="mail" className="size-5 shrink-0 text-sky" />
              <a href={`mailto:${settings.email}`} className="[overflow-wrap:anywhere] hover:text-white">
                {settings.email}
              </a>
            </p>
          )}
        </address>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site flex flex-col gap-3 py-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} MSA — Mateos Saint Malo & Asociados. {dict.footer.rights}
          </p>
          <div className="flex gap-5">
            <Link href={href(locale, 'privacidad')} className="hover:text-white">
              {dict.footer.privacy}
            </Link>
            <CookiePreferencesButton label={dict.footer.cookies} />
          </div>
        </div>
        <p className="container-site pb-6 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-white/35">
          {dict.brand.pillars.join('  |  ')}
        </p>
      </div>
    </footer>
  )
}
