// Configuración de idiomas compartida por el proxy, Payload y el front.

export const locales = ['es', 'en', 'pt', 'it'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'es'

export const localeLabels: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
  pt: 'Português',
  it: 'Italiano',
}

// Para <html lang> y Open Graph.
export const localeTags: Record<Locale, string> = {
  es: 'es-PA',
  en: 'en',
  pt: 'pt-BR',
  it: 'it-IT',
}

export const isLocale = (value: string | undefined | null): value is Locale =>
  !!value && (locales as readonly string[]).includes(value)

/**
 * Rutas fijas del sitio. La clave es la carpeta interna en `src/app/(frontend)/[locale]`
 * (en español); el valor es el segmento público en cada idioma.
 * /en/services se reescribe internamente a /en/servicios.
 */
export const routeSegments = {
  nosotros: { es: 'nosotros', en: 'about', pt: 'sobre', it: 'chi-siamo' },
  equipo: { es: 'equipo', en: 'team', pt: 'equipe', it: 'team' },
  servicios: { es: 'servicios', en: 'services', pt: 'servicos', it: 'servizi' },
  'casos-de-exito': { es: 'casos-de-exito', en: 'success-stories', pt: 'casos-de-sucesso', it: 'casi-di-successo' },
  'cultura-msa': { es: 'cultura-msa', en: 'msa-culture', pt: 'cultura-msa', it: 'cultura-msa' },
  blog: { es: 'blog', en: 'blog', pt: 'blog', it: 'blog' },
  contacto: { es: 'contacto', en: 'contact', pt: 'contato', it: 'contatti' },
  privacidad: { es: 'privacidad', en: 'privacy', pt: 'privacidade', it: 'privacy' },
} as const satisfies Record<string, Record<Locale, string>>

/** Rutas fijas que se arman con el builder: la página de Payload con ese slug. */
export const builderRoutes = ['nosotros', 'casos-de-exito', 'cultura-msa', 'privacidad'] as const

export type RouteKey = keyof typeof routeSegments

/** Segmento público (p. ej. "services") → carpeta interna ("servicios"). */
export function internalSegment(locale: Locale, segment: string): RouteKey | null {
  for (const key of Object.keys(routeSegments) as RouteKey[]) {
    if (routeSegments[key][locale] === segment) return key
  }
  return null
}

/** Arma una ruta pública: href('en', 'servicios', 'asesoria-tributaria') → /en/services/asesoria-tributaria */
export function href(locale: Locale, route?: RouteKey | '', ...rest: string[]): string {
  const parts: string[] = [locale]
  if (route) parts.push(routeSegments[route][locale])
  parts.push(...rest.filter(Boolean))
  return '/' + parts.join('/')
}

/**
 * Traduce una ruta pública de un idioma a otro (selector de idioma).
 * /en/services/x → /pt/servicos/x
 */
export function switchLocalePath(pathname: string, to: Locale): string {
  const [, maybeLocale, segment, ...rest] = pathname.split('/')
  if (!isLocale(maybeLocale)) return `/${to}`
  if (!segment) return `/${to}`
  const key = internalSegment(maybeLocale, segment) ?? internalSegment(defaultLocale, segment)
  const target = key ? routeSegments[key][to] : segment
  return '/' + [to, target, ...rest].filter(Boolean).join('/')
}
