'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { localeLabels, locales, switchLocalePath, type Locale } from '@/i18n/config'
import type { ResolvedLink } from '@/lib/links'
import type { NavItem } from '@/lib/site'
import { Icon } from './Icon'
import { Logo } from './Logo'

// Recordar el idioma elegido (el proxy lo usa al entrar sin idioma en la URL).
function rememberLocale(l: Locale) {
  document.cookie = `NEXT_LOCALE=${l}; path=/; max-age=31536000; samesite=lax`
}

type Labels = {
  book: string
  menu: string
  close: string
  language: string
  home: string
  allServices: string
  servicesIntro: string
}

export function Header({
  locale,
  items,
  booking,
  labels,
}: {
  locale: Locale
  items: NavItem[]
  booking: ResolvedLink
  labels: Labels
}) {
  const pathname = usePathname() ?? `/${locale}`
  const [open, setOpen] = useState(false) // menú móvil
  const [mega, setMega] = useState<string | null>(null) // submenú de escritorio abierto
  const [mobileSub, setMobileSub] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Al navegar, se cierran todos los menús (ajuste de estado durante el render, sin efecto).
  const [lastPath, setLastPath] = useState(pathname)
  if (pathname !== lastPath) {
    setLastPath(pathname)
    setOpen(false)
    setMega(null)
  }

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMega(null)
        setOpen(false)
      }
    }
    const onClick = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setMega(null)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('click', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('click', onClick)
    }
  }, [])

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')
  const bookProps = booking.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}
  const openMega = (href: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setMega(href)
  }
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setMega(null), 160)
  }

  const megaItem = items.find((i) => i.href === mega && i.children?.length)
  const solid = scrolled || open || !!megaItem

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-50 text-white transition-colors duration-300 ${
        solid ? 'bg-ink/95 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.8)] backdrop-blur' : 'bg-transparent'
      }`}
    >
      <div className="container-site flex h-18 items-center justify-between gap-6 lg:h-20">
        <Link href={`/${locale}`} aria-label={labels.home} className="shrink-0 text-[15px] lg:text-base">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Principal">
          {items.map((item) =>
            item.children?.length ? (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => openMega(item.href)}
                onMouseLeave={scheduleClose}
              >
                <button
                  type="button"
                  aria-expanded={mega === item.href}
                  aria-controls="mega-menu"
                  onClick={() => setMega((m) => (m === item.href ? null : item.href))}
                  className={`flex items-center gap-1 rounded-full px-3 py-2 text-[0.8rem] font-semibold tracking-wide transition hover:text-sky ${
                    isActive(item.href) || mega === item.href ? 'text-sky' : 'text-white/90'
                  }`}
                >
                  {item.label}
                  <Icon
                    name="chevronDown"
                    className={`size-3.5 transition ${mega === item.href ? 'rotate-180' : ''}`}
                  />
                </button>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={`rounded-full px-3 py-2 text-[0.8rem] font-semibold tracking-wide transition hover:text-sky ${
                  isActive(item.href) ? 'text-sky' : 'text-white/90'
                }`}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <details className="group relative hidden sm:block">
            <summary
              className="flex cursor-pointer list-none items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold uppercase tracking-widest text-white/90 hover:text-white [&::-webkit-details-marker]:hidden"
              aria-label={labels.language}
            >
              <Icon name="globe" className="size-4" />
              {locale}
              <Icon name="chevronDown" className="size-3.5 transition group-open:rotate-180" />
            </summary>
            <ul className="absolute right-0 mt-2 w-40 overflow-hidden rounded-xl bg-white py-1 text-sm text-ink shadow-xl">
              {locales.map((l) => (
                <li key={l}>
                  <Link
                    href={switchLocalePath(pathname, l)}
                    hrefLang={l}
                    onClick={() => rememberLocale(l)}
                    className={`block px-4 py-2 hover:bg-mist ${l === locale ? 'font-bold text-electric' : ''}`}
                  >
                    {localeLabels[l]}
                  </Link>
                </li>
              ))}
            </ul>
          </details>

          <a href={booking.href} {...bookProps} data-track="booking-header" className="btn-primary hidden min-h-10 px-5 text-xs md:inline-flex">
            <Icon name="calendar" className="size-4" />
            {labels.book}
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid size-11 place-items-center rounded-full border border-white/25 xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? labels.close : labels.menu}
          >
            <Icon name={open ? 'close' : 'menu'} className="size-5" />
          </button>
        </div>
      </div>

      {/* Mega menú de servicios (escritorio): todas las áreas a un clic desde cualquier página */}
      {megaItem && (
        <div
          id="mega-menu"
          className="absolute inset-x-0 top-full hidden border-t border-white/10 bg-ink shadow-2xl xl:block"
          onMouseEnter={() => openMega(megaItem.href)}
          onMouseLeave={scheduleClose}
        >
          <div className="container-site grid grid-cols-12 gap-10 py-10">
            <div className="col-span-3 border-r border-white/10 pr-8">
              <p className="eyebrow eyebrow-start mb-4 text-sky">{megaItem.label}</p>
              <p className="text-sm leading-relaxed text-haze">{labels.servicesIntro}</p>
              <Link href={megaItem.href} className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-white hover:text-sky">
                {labels.allServices}
                <Icon name="arrow" className="size-4" />
              </Link>
              <a href={booking.href} {...bookProps} data-track="booking-mega" className="btn-primary mt-6 min-h-10 px-5 text-xs">
                <Icon name="calendar" className="size-4" />
                {labels.book}
              </a>
            </div>
            <ul className="col-span-9 grid grid-cols-3 gap-2">
              {megaItem.children!.map((child) => (
                <li key={child.href}>
                  <Link
                    href={child.href}
                    aria-current={isActive(child.href) ? 'page' : undefined}
                    className={`group flex gap-4 rounded-xl p-4 transition hover:bg-white/[0.06] ${
                      isActive(child.href) ? 'bg-white/[0.06] ring-1 ring-sky/40' : ''
                    }`}
                  >
                    <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-electric/20 text-sky group-hover:bg-electric group-hover:text-white">
                      <Icon name={child.icon} className="size-6" />
                    </span>
                    <span>
                      <span className="block text-sm font-black uppercase leading-tight text-white">{child.label}</span>
                      {child.summary && (
                        <span className="mt-1 line-clamp-2 block text-xs leading-relaxed text-haze">{child.summary}</span>
                      )}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Menú móvil */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-white/10 bg-ink xl:hidden"
      >
        <nav className="container-site flex flex-col py-6" aria-label="Principal">
          {items.map((item) =>
            item.children?.length ? (
              <div key={item.href} className="border-b border-white/10">
                <div className="flex items-center justify-between">
                  <Link
                    href={item.href}
                    className={`flex-1 py-4 text-2xl font-black uppercase ${isActive(item.href) ? 'text-sky' : 'text-white'}`}
                  >
                    {item.label}
                  </Link>
                  <button
                    type="button"
                    onClick={() => setMobileSub((s) => (s === item.href ? null : item.href))}
                    aria-expanded={mobileSub === item.href}
                    aria-label={item.label}
                    className="grid size-11 place-items-center rounded-full border border-white/20"
                  >
                    <Icon name="chevronDown" className={`size-5 transition ${mobileSub === item.href ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                {mobileSub === item.href && (
                  <ul className="mb-4 space-y-1 border-l-2 border-electric pl-4">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className={`flex items-center gap-3 py-2.5 text-base font-bold ${
                            isActive(child.href) ? 'text-sky' : 'text-white/85'
                          }`}
                        >
                          <Icon name={child.icon} className="size-5 text-sky" />
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`border-b border-white/10 py-4 text-2xl font-black uppercase ${
                  isActive(item.href) ? 'text-sky' : 'text-white'
                }`}
              >
                {item.label}
              </Link>
            ),
          )}
          <a href={booking.href} {...bookProps} className="btn-primary mt-8">
            <Icon name="calendar" className="size-5" />
            {labels.book}
          </a>
          <div className="mt-8 flex flex-wrap gap-2" aria-label={labels.language}>
            {locales.map((l) => (
              <Link
                key={l}
                href={switchLocalePath(pathname, l)}
                hrefLang={l}
                onClick={() => rememberLocale(l)}
                className={`rounded-full border px-4 py-2 text-sm ${
                  l === locale ? 'border-sky bg-sky/10 font-bold text-sky' : 'border-white/20 text-white/80'
                }`}
              >
                {localeLabels[l]}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  )
}
