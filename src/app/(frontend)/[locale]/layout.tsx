import type { Metadata, Viewport } from 'next'
import { CookieBanner } from '@/components/CookieBanner'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { WhatsAppFloat, WhatsAppProvider } from '@/components/WhatsApp'
import { href, localeTags } from '@/i18n'
import { getSite } from '@/lib/site'
import '../globals.css'

// Páginas en caché (ISR): se generan en la primera visita y se invalidan
// cuando el equipo publica cambios en el panel.
export const revalidate = 3600
export const generateStaticParams = async () => []

export const viewport: Viewport = { themeColor: '#030823', width: 'device-width', initialScale: 1 }

export async function generateMetadata({ params }: LayoutProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params
  const { dict } = await getSite(locale)
  const base = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  return {
    metadataBase: new URL(base),
    title: { default: dict.meta.defaultTitle, template: `%s · ${dict.meta.siteName}` },
    description: dict.meta.defaultDescription,
    openGraph: { siteName: dict.meta.siteName, locale: localeTags[locale as keyof typeof localeTags], type: 'website' },
    icons: { icon: '/favicon.svg' },
  }
}

export default async function LocaleLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale: param } = await params
  const site = await getSite(param)
  const { locale, dict, settings, nav, booking } = site

  return (
    <html lang={localeTags[locale]}>
      <body>
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-ink"
        >
          {dict.nav.skipToContent}
        </a>
        <WhatsAppProvider number={settings.whatsappNumber} defaultMessage={site.whatsappMessage}>
          <Header
            locale={locale}
            items={nav}
            booking={booking}
            labels={{
              book: dict.nav.book,
              menu: dict.nav.menu,
              close: dict.nav.close,
              language: dict.nav.language,
              home: dict.nav.home,
              allServices: dict.common.allServices,
              servicesIntro: dict.services.intro,
            }}
          />
          <main id="contenido" className="overflow-x-clip">
            {children}
          </main>
          <Footer locale={locale} dict={dict} settings={settings} nav={nav} services={site.serviceLinks} />
          <WhatsAppFloat label={dict.common.writeWhatsApp} />
        </WhatsAppProvider>
        <CookieBanner gaId={settings.gaId} privacyHref={href(locale, 'privacidad')} labels={dict.cookies} />
      </body>
    </html>
  )
}
