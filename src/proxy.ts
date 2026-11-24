import { NextResponse, type NextRequest } from 'next/server'
import { defaultLocale, internalSegment, isLocale, locales, type Locale } from './i18n/config'

// 1. Sin idioma en la URL → redirige al idioma del navegador (o español).
// 2. Con idioma y segmento traducido (/en/services) → reescribe a la carpeta interna (/en/servicios).

function preferredLocale(request: NextRequest): Locale {
  const cookie = request.cookies.get('NEXT_LOCALE')?.value
  if (isLocale(cookie)) return cookie
  const header = request.headers.get('accept-language') ?? ''
  const ranked = header
    .split(',')
    .map((part) => {
      const [tag, q] = part.trim().split(';q=')
      return { lang: tag.slice(0, 2).toLowerCase(), q: q ? Number(q) : 1 }
    })
    .sort((a, b) => b.q - a.q)
  for (const { lang } of ranked) if (isLocale(lang)) return lang
  return defaultLocale
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const [, first, second, ...rest] = pathname.split('/')

  if (!isLocale(first)) {
    const url = request.nextUrl.clone()
    url.pathname = `/${preferredLocale(request)}${pathname === '/' ? '' : pathname}`
    return NextResponse.redirect(url)
  }

  if (second) {
    const key = internalSegment(first, second)
    if (key && key !== second) {
      const url = request.nextUrl.clone()
      url.pathname = '/' + [first, key, ...rest].join('/')
      return NextResponse.rewrite(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  // Todo menos el panel, la API, archivos internos de Next y archivos con extensión.
  matcher: ['/((?!admin|api|_next|next|media|favicon|robots|sitemap|.*\\..*).*)'],
}

export { locales }
