'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Shards } from '@/components/Decor'
import { defaultLocale, isLocale, type Locale } from '@/i18n/config'

// Componente de cliente: si leyera headers() en el servidor, todas las páginas
// dejarían de servirse desde caché. El idioma se toma de la URL.
const copy: Record<Locale, { title: string; text: string; back: string }> = {
  es: {
    title: 'Esta página no existe',
    text: 'Puede que el enlace haya cambiado. Vuelve al inicio o escríbenos y te ayudamos.',
    back: 'Ir al inicio',
  },
  en: {
    title: 'This page does not exist',
    text: 'The link may have changed. Go back home or message us and we will help you.',
    back: 'Go home',
  },
  pt: {
    title: 'Esta página não existe',
    text: 'O link pode ter mudado. Volte ao início ou fale conosco e ajudaremos você.',
    back: 'Ir para o início',
  },
  it: {
    title: 'Questa pagina non esiste',
    text: 'Il link potrebbe essere cambiato. Torna alla home o scrivici e ti aiuteremo.',
    back: 'Torna alla home',
  },
}

export default function NotFound() {
  const maybe = usePathname()?.split('/')[1]
  const locale = isLocale(maybe) ? maybe : defaultLocale
  const t = copy[locale]
  return (
    <section className="surface-dark on-dark relative isolate flex min-h-[80svh] items-center overflow-hidden">
      <Shards className="-z-10" line />
      <div className="container-site pt-28 pb-20">
        <p className="font-display text-8xl text-electric-2">404</p>
        <h1 className="headline-lg mt-4 text-white">{t.title}</h1>
        <p className="mt-5 max-w-xl text-lg text-haze">{t.text}</p>
        <Link href={`/${locale}`} className="btn-primary mt-9">
          {t.back}
        </Link>
      </div>
    </section>
  )
}
