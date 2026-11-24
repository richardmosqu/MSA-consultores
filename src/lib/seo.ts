import type { Metadata } from 'next'
import { href, locales, localeTags, type Locale, type RouteKey } from '@/i18n/config'
import type { Media } from '@/payload-types'

type Meta = { title?: string | null; description?: string | null; image?: number | Media | null } | null | undefined

/** Metadatos con hreflang para los 4 idiomas y canonical por idioma. */
export function pageMetadata({
  locale,
  route = '',
  rest = [],
  title,
  description,
  meta,
}: {
  locale: Locale
  route?: RouteKey | ''
  rest?: string[]
  title?: string | null
  description?: string | null
  meta?: Meta
}): Metadata {
  const languages = Object.fromEntries(locales.map((l) => [localeTags[l], href(l, route, ...rest)]))
  const finalTitle = meta?.title || title || undefined
  const finalDescription = meta?.description || description || undefined
  const image = meta?.image && typeof meta.image === 'object' ? meta.image.url : undefined
  return {
    title: finalTitle ? { absolute: finalTitle.includes('MSA') ? finalTitle : `${finalTitle} · MSA Consultores` } : undefined,
    description: finalDescription,
    alternates: { canonical: href(locale, route, ...rest), languages: { ...languages, 'x-default': href('es', route, ...rest) } },
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      images: image ? [{ url: image }] : undefined,
    },
  }
}
