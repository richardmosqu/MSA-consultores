'use client'

import Link from 'next/link'
import Script from 'next/script'
import { useSyncExternalStore } from 'react'

// Aviso de cookies (Ley 81 de 2019). La analítica solo se carga si la persona acepta.
// La elección vive en localStorage; un pequeño "store" permite reabrir el aviso desde el footer.
const KEY = 'msa-cookie-consent'
type Choice = 'all' | 'necessary'
type Snapshot = Choice | 'unset' | 'server'

const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())

function subscribe(cb: () => void) {
  listeners.add(cb)
  window.addEventListener('storage', cb)
  return () => {
    listeners.delete(cb)
    window.removeEventListener('storage', cb)
  }
}

function getSnapshot(): Snapshot {
  try {
    const v = localStorage.getItem(KEY)
    return v === 'all' || v === 'necessary' ? v : 'unset'
  } catch {
    return 'unset'
  }
}

function saveChoice(c: Choice | null) {
  try {
    if (c) localStorage.setItem(KEY, c)
    else localStorage.removeItem(KEY)
  } catch {}
  emit()
}

export const reopenCookieBanner = () => saveChoice(null)

export function CookieBanner({
  gaId,
  privacyHref,
  labels,
}: {
  gaId?: string | null
  privacyHref: string
  labels: { text: string; accept: string; reject: string; more: string }
}) {
  const choice = useSyncExternalStore(subscribe, getSnapshot, () => 'server' as const)

  return (
    <>
      {gaId && choice === 'all' && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${gaId}',{anonymize_ip:true});
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('[data-track]');if(a)gtag('event','cta_click',{cta:a.getAttribute('data-track')})});`}
          </Script>
        </>
      )}
      {choice === 'unset' && (
        <div
          role="dialog"
          aria-live="polite"
          aria-label="Cookies"
          className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-3xl rounded-[24px] bg-white p-5 text-sm text-ink shadow-[0_30px_60px_-20px_rgba(12,26,71,0.45)] ring-1 ring-line sm:inset-x-6 sm:bottom-6 sm:flex sm:items-center sm:gap-6"
        >
          <p className="leading-relaxed text-muted">
            {labels.text}{' '}
            <Link href={privacyHref} className="font-semibold text-ink underline underline-offset-4">
              {labels.more}
            </Link>
          </p>
          <div className="mt-4 flex shrink-0 gap-2 sm:mt-0">
            <button type="button" onClick={() => saveChoice('necessary')} className="btn-outline h-10 px-4 text-xs">
              {labels.reject}
            </button>
            <button type="button" onClick={() => saveChoice('all')} className="btn-accent h-10 px-4 text-xs">
              {labels.accept}
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export function CookiePreferencesButton({ label }: { label: string }) {
  return (
    <button type="button" onClick={reopenCookieBanner} className="hover:text-white">
      {label}
    </button>
  )
}
