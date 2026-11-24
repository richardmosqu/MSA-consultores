import 'server-only'
import { notFound } from 'next/navigation'
import { getDictionary, href, isLocale, type Locale } from '@/i18n'
import { bookingLink } from './links'
import { getServices, getSettings } from './payload'

export type ServiceLink = { href: string; label: string; icon: string; summary: string }
export type NavItem = { href: string; label: string; children?: ServiceLink[] }

/** Lo que casi todas las páginas necesitan: idioma validado, textos, ajustes y navegación. */
export async function getSite(localeParam: string) {
  if (!isLocale(localeParam)) notFound()
  const locale: Locale = localeParam
  const dict = getDictionary(locale)
  const [settings, services] = await Promise.all([getSettings(locale), getServices(locale)])
  // Menú de servicios: se muestra desplegado en el header, el footer y las páginas de servicio
  // para que siempre se pueda saltar de un área a otra sin volver atrás.
  const serviceLinks: ServiceLink[] = services.map((s) => ({
    href: href(locale, 'servicios', s.slug ?? ''),
    label: s.title,
    icon: s.icon ?? 'shield',
    summary: s.summary ?? '',
  }))
  const nav: NavItem[] = [
    { href: href(locale, 'nosotros'), label: dict.nav.about },
    { href: href(locale, 'equipo'), label: dict.nav.team },
    { href: href(locale, 'servicios'), label: dict.nav.services, children: serviceLinks },
    { href: href(locale, 'casos-de-exito'), label: dict.nav.cases },
    { href: href(locale, 'cultura-msa'), label: dict.nav.culture },
    { href: href(locale, 'blog'), label: dict.nav.blog },
    { href: href(locale, 'contacto'), label: dict.nav.contact },
  ]
  return {
    locale,
    dict,
    settings,
    nav,
    serviceLinks,
    booking: bookingLink(settings, locale),
    whatsappMessage: settings.whatsappMessage || dict.whatsapp.default,
  }
}

export type Site = Awaited<ReturnType<typeof getSite>>
