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
  const [mega, setMega] = useState<string | null>(null) // submenú de escritorio
  const [mobileSub, setMobileSub] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Al navegar, se cierran los menús (ajuste de estado durante el render).
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
  // Sobre el hero el header es transparente; al bajar (o con un menú abierto) se vuelve una barra blanca.
  const solid = scrolled || open || !!megaItem
  const linkBase = solid ? 'text-ink/80 hover:text-ink' : 'text-white/85 hover:text-white'
  const linkActive = solid ? 'text-accent' : 'text-white'

  return (
    <header ref={headerRef} className="fixed inset-x-0 top-0 z-50 px-2 pt-2 sm:px-3 sm:pt-3">
      <div
        className={`mx-auto flex h-16 max-w-[calc(80rem+2rem)] items-center justify-between gap-4 rounded-full pr-2 pl-5 transition duration-300 sm:h-[4.5rem] sm:pl-7 ${
          solid ? 'bg-white/95 text-ink shadow-[0_12px_40px_-20px_rgba(12,26,71,0.45)] backdrop-blur' : 'text-white'
        }`}
      >
        <Link href={`/${locale}`} aria-label={labels.home} className="shrink-0 text-[14px] sm:text-[15px]">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 xl:flex" aria-label="Principal">
          {items.map((item) =>
            item.children?.length ? (
              <div key={item.href} onMouseEnter={() => openMega(item.href)} onMouseLeave={scheduleClose}>
                <button
                  type="button"
                  aria-expanded={mega === item.href}
                  aria-controls="mega-menu"
                  onClick={() => setMega((m) => (m === item.href ? null : item.href))}
                  className={`flex items-center gap-1 rounded-full px-3 py-2 text-[0.84rem] font-medium transition ${
                    isActive(item.href) || mega === item.href ? linkActive : linkBase
                  }`}
                >
                  {item.label}
                  <Icon name="chevronDown" className={`size-3.5 transition ${mega === item.href ? 'rotate-180' : ''}`} />
                </button>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={`rounded-full px-3 py-2 text-[0.84rem] font-medium transition ${
                  isActive(item.href) ? linkActive : linkBase
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
              className={`flex h-10 cursor-pointer list-none items-center gap-1.5 rounded-full px-3.5 text-xs font-semibold uppercase [&::-webkit-details-marker]:hidden ${
                solid ? 'bg-surface text-ink' : 'bg-white/15 text-white backdrop-blur'
              }`}
              aria-label={labels.language}
            >
              <Icon name="globe" className="size-4" />
              {locale}
            </summary>
            <ul className="absolute right-0 mt-2 w-40 overflow-hidden rounded-2xl bg-white p-1 text-sm text-ink shadow-xl ring-1 ring-line">
              {locales.map((l) => (
                <li key={l}>
                  <Link
                    href={switchLocalePath(pathname, l)}
                    hrefLang={l}
                    onClick={() => rememberLocale(l)}
                    className={`block rounded-xl px-3 py-2 hover:bg-surface ${l === locale ? 'font-semibold text-accent' : ''}`}
                  >
                    {localeLabels[l]}
                  </Link>
                </li>
              ))}
            </ul>
          </details>

          <a
            href={booking.href}
            {...bookProps}
            data-track="booking-header"
            className="btn-accent hidden h-11 px-5 md:inline-flex"
          >
            {labels.book}
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={`grid size-11 place-items-center rounded-full xl:hidden ${
              solid ? 'bg-surface text-ink' : 'bg-white/15 text-white backdrop-blur'
            }`}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? labels.close : labels.menu}
          >
            <Icon name={open ? 'close' : 'menu'} className="size-5" />
          </button>
        </div>
      </div>

      {/* Menú de servicios (escritorio): todas las áreas a un clic desde cualquier página */}
      {megaItem && (
        <div
          id="mega-menu"
          className="mx-auto mt-2 hidden max-w-[calc(80rem+2rem)] rounded-[28px] bg-white p-3 text-ink shadow-[0_30px_60px_-30px_rgba(12,26,71,0.45)] ring-1 ring-line xl:block"
          onMouseEnter={() => openMega(megaItem.href)}
          onMouseLeave={scheduleClose}
        >
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-3 flex flex-col rounded-[22px] bg-surface p-7">
              <p className="pill-label self-start">{megaItem.label}</p>
              <p className="mt-5 text-sm leading-relaxed text-muted">{labels.servicesIntro}</p>
              <div className="mt-auto flex flex-col gap-3 pt-8">
                <Link href={megaItem.href} className="btn-outline h-11 justify-between">
                  {labels.allServices}
                  <Icon name="arrowUpRight" className="size-4" />
                </Link>
                <a href={booking.href} {...bookProps} data-track="booking-mega" className="btn-accent h-11 justify-between">
                  {labels.book}
                  <Icon name="arrowUpRight" className="size-4" />
                </a>
              </div>
            </div>
            <ul className="col-span-9 grid grid-cols-3 gap-1 p-2">
              {megaItem.children!.map((child) => (
                <li key={child.href}>
                  <Link
                    href={child.href}
                    aria-current={isActive(child.href) ? 'page' : undefined}
                    className={`group flex gap-4 rounded-2xl p-4 transition hover:bg-surface ${
                      isActive(child.href) ? 'bg-surface' : ''
                    }`}
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent-soft text-accent transition group-hover:bg-accent group-hover:text-white">
                      <Icon name={child.icon} className="size-5" />
                    </span>
                    <span>
                      <span className="block font-display text-[0.98rem] leading-tight font-medium">{child.label}</span>
                      {child.summary && (
                        <span className="mt-1 line-clamp-2 block text-xs leading-relaxed text-muted">{child.summary}</span>
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
        className="mt-2 max-h-[calc(100dvh-5.5rem)] overflow-y-auto rounded-[28px] bg-white text-ink shadow-2xl ring-1 ring-line xl:hidden"
      >
        <nav className="flex flex-col p-5" aria-label="Principal">
          {items.map((item) =>
            item.children?.length ? (
              <div key={item.href} className="border-b border-line">
                <div className="flex items-center justify-between">
                  <Link
                    href={item.href}
                    className={`flex-1 py-3.5 font-display text-xl ${isActive(item.href) ? 'text-accent' : ''}`}
                  >
                    {item.label}
                  </Link>
                  <button
                    type="button"
                    onClick={() => setMobileSub((s) => (s === item.href ? null : item.href))}
                    aria-expanded={mobileSub === item.href}
                    aria-label={item.label}
                    className="grid size-10 place-items-center rounded-full bg-surface"
                  >
                    <Icon name="chevronDown" className={`size-4.5 transition ${mobileSub === item.href ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                {mobileSub === item.href && (
                  <ul className="mb-3 space-y-0.5 rounded-2xl bg-surface p-2">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.95rem] font-medium ${
                            isActive(child.href) ? 'bg-white text-accent' : ''
                          }`}
                        >
                          <span className="grid size-8 place-items-center rounded-full bg-accent-soft text-accent">
                            <Icon name={child.icon} className="size-4" />
                          </span>
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
                className={`border-b border-line py-3.5 font-display text-xl ${isActive(item.href) ? 'text-accent' : ''}`}
              >
                {item.label}
              </Link>
            ),
          )}
          <a href={booking.href} {...bookProps} className="btn-accent mt-6">
            {labels.book}
          </a>
          <div className="mt-5 flex flex-wrap gap-2" aria-label={labels.language}>
            {locales.map((l) => (
              <Link
                key={l}
                href={switchLocalePath(pathname, l)}
                hrefLang={l}
                onClick={() => rememberLocale(l)}
                className={`rounded-full px-4 py-2 text-sm ${
                  l === locale ? 'bg-ink font-semibold text-white' : 'bg-surface text-ink'
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
