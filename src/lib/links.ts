import { href, type Locale, type RouteKey } from '@/i18n/config'
import type { SiteSetting } from '@/payload-types'

export const whatsappHref = (number: string | null | undefined, message: string) => {
  const digits = (number ?? '').replace(/\D/g, '')
  if (!digits) return null
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}

export type ResolvedLink = { href: string; external: boolean; kind: 'booking' | 'whatsapp' | 'internal' | 'custom' }

/**
 * Destino del botón "Agendar".
 * Hoy (plan B): página de reservas de MSA en Tilín. Cuando llegue la API de Tilín,
 * este es el único punto que cambia para abrir la reserva dentro del sitio.
 */
export function bookingLink(settings: SiteSetting, locale: Locale, override?: string | null): ResolvedLink {
  const url = override || settings.bookingUrl
  if (settings.bookingMode !== 'contact' && url) {
    const withLang = new URL(url)
    if (!withLang.searchParams.has('lang')) withLang.searchParams.set('lang', locale)
    return { href: withLang.toString(), external: true, kind: 'booking' }
  }
  return { href: `${href(locale, 'contacto')}#mensaje`, external: false, kind: 'booking' }
}

type LinkValue = {
  type?: 'booking' | 'whatsapp' | 'internal' | 'custom' | 'none' | null
  label?: string | null
  route?: string | null
  url?: string | null
} | null | undefined

export function resolveLink(
  link: LinkValue,
  ctx: { settings: SiteSetting; locale: Locale; whatsappMessage: string },
): (ResolvedLink & { label?: string | null }) | null {
  if (!link?.type || link.type === 'none') return null
  switch (link.type) {
    case 'booking':
      return { ...bookingLink(ctx.settings, ctx.locale), label: link.label }
    case 'whatsapp': {
      const wa = whatsappHref(ctx.settings.whatsappNumber, ctx.whatsappMessage)
      return wa ? { href: wa, external: true, kind: 'whatsapp', label: link.label } : null
    }
    case 'internal': {
      const route = link.route === 'inicio' || !link.route ? '' : (link.route as RouteKey)
      return { href: href(ctx.locale, route), external: false, kind: 'internal', label: link.label }
    }
    case 'custom':
      return link.url
        ? { href: link.url, external: /^https?:/.test(link.url), kind: 'custom', label: link.label }
        : null
  }
}
