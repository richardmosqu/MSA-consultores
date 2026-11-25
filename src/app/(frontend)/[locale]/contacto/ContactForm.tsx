'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import type { Dictionary } from '@/i18n'
import { sendContact, type ContactState } from './actions'

export function ContactForm({
  locale,
  labels,
  services,
  privacyHref,
}: {
  locale: string
  labels: Dictionary['contact']['form']
  services: string[]
  privacyHref: string
}) {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendContact, { status: 'idle' })

  if (state.status === 'ok') {
    return (
      <p role="status" className="rounded-[24px] bg-accent-soft p-8 font-display text-xl text-ink">
        {labels.success}
      </p>
    )
  }

  const input =
    'w-full rounded-2xl border border-transparent bg-surface px-4 py-3.5 text-[0.95rem] text-ink placeholder:text-muted/60 focus:border-accent focus:bg-white focus:outline-none focus:ring-4 focus:ring-accent/10'
  const label = 'mb-2 block text-sm font-medium text-ink'

  return (
    <form action={action} className="grid gap-5 sm:grid-cols-2" noValidate={false}>
      <input type="hidden" name="locale" value={locale} />
      <div className="hidden" aria-hidden>
        <label>
          Website <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div>
        <label htmlFor="cf-name" className={label}>
          {labels.name} *
        </label>
        <input id="cf-name" name="name" required autoComplete="name" className={input} />
      </div>
      <div>
        <label htmlFor="cf-email" className={label}>
          {labels.email} *
        </label>
        <input id="cf-email" name="email" type="email" required autoComplete="email" className={input} />
      </div>
      <div>
        <label htmlFor="cf-phone" className={label}>
          {labels.phone}
        </label>
        <input id="cf-phone" name="phone" type="tel" autoComplete="tel" className={input} />
      </div>
      <div>
        <label htmlFor="cf-company" className={label}>
          {labels.company}
        </label>
        <input id="cf-company" name="company" autoComplete="organization" className={input} />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="cf-service" className={label}>
          {labels.service}
        </label>
        <select id="cf-service" name="service" className={input} defaultValue="">
          <option value="">{labels.serviceNone}</option>
          {services.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="cf-message" className={label}>
          {labels.message} *
        </label>
        <textarea id="cf-message" name="message" required rows={5} className={input} />
      </div>
      <label className="flex gap-3 text-sm leading-relaxed text-muted sm:col-span-2">
        <input type="checkbox" name="consent" required className="mt-1 size-4 shrink-0 accent-accent" />
        <span>
          {labels.consent}{' '}
          <Link href={privacyHref} className="font-semibold text-accent underline underline-offset-2">
            ↗
          </Link>
        </span>
      </label>
      {(state.status === 'error' || state.status === 'invalid') && (
        <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-700 sm:col-span-2">
          {state.status === 'invalid' ? labels.required : labels.error}
        </p>
      )}
      <div className="sm:col-span-2">
        <button type="submit" disabled={pending} className="btn-accent w-full sm:w-auto disabled:opacity-60">
          {pending ? labels.sending : labels.submit}
        </button>
      </div>
    </form>
  )
}
