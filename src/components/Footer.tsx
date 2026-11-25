import Link from 'next/link'
import { href, type Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n'
import type { SiteSetting } from '@/payload-types'
import type { ServiceLink } from '@/lib/site'
import { CookiePreferencesButton } from './CookieBanner'
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
  const heading = 'mb-5 text-xs font-semibold tracking-[0.12em] text-white/45 uppercase'

  return (
    <footer className="px-0 pt-3 pb-2 sm:pb-3">
      <div className="frame bg-ink text-white/70">
        <div className="container-site grid gap-12 py-16 md:grid-cols-12">
          <div className="md:col-span-4">
            <Logo className="text-lg text-white" />
            <p className="mt-6 max-w-xs text-sm leading-relaxed">{dict.brand.tagline}</p>
            {socials.length > 0 && (
              <div className="mt-8 flex gap-2">
                {socials.map((k) => (
                  <a
                    key={k}
                    href={settings[k] as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={k}
                    className="grid size-10 place-items-center rounded-dot bg-white/10 text-white transition hover:bg-white hover:text-ink"
                  >
                    <Icon name={k} className="size-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <nav className="md:col-span-3" aria-label={dict.common.serviceAreas}>
            <p className={heading}>{dict.nav.services}</p>
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
            <p className={heading}>{dict.footer.sections}</p>
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

          <address className="space-y-3 text-sm not-italic md:col-span-3">
            <p className={heading}>{dict.nav.contact}</p>
            {settings.address && (
              <p className="whitespace-pre-line leading-relaxed">{settings.address}</p>
            )}
            {settings.phones?.map((p) => (
              <p key={p.id ?? p.number}>
                <a href={`tel:${p.number.replace(/[^\d+]/g, '')}`} className="hover:text-white">
                  {p.number}
                </a>
              </p>
            ))}
            {settings.email && (
              <p>
                <a
                  href={`mailto:${settings.email}`}
                  className="[overflow-wrap:anywhere] hover:text-white"
                >
                  {settings.email}
                </a>
              </p>
            )}
          </address>
        </div>

        <div className="container-site">
          <div className="flex flex-col gap-3 border-t border-white/10 py-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
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
        </div>
      </div>
    </footer>
  )
}
