'use server'

import { isLocale } from '@/i18n/config'
import { getPayloadClient } from '@/lib/payload'

export type ContactState = { status: 'idle' | 'ok' | 'error' | 'invalid' }

const clean = (v: FormDataEntryValue | null, max = 2000) =>
  typeof v === 'string' ? v.trim().slice(0, max) : ''

/**
 * Guarda el mensaje en el panel (siempre) y avisa por correo con Resend (si hay API key).
 * Así no se pierde ningún contacto aunque falle el correo.
 */
export async function sendContact(_: ContactState, form: FormData): Promise<ContactState> {
  // Trampa para bots: campo oculto que una persona nunca llena.
  if (clean(form.get('website'))) return { status: 'ok' }

  const data = {
    name: clean(form.get('name'), 120),
    email: clean(form.get('email'), 160),
    phone: clean(form.get('phone'), 40),
    company: clean(form.get('company'), 120),
    service: clean(form.get('service'), 120),
    message: clean(form.get('message'), 4000),
    locale: clean(form.get('locale'), 5),
  }
  const consent = form.get('consent') === 'on'
  if (!data.name || !/^\S+@\S+\.\S+$/.test(data.email) || !data.message || !consent) {
    return { status: 'invalid' }
  }

  try {
    const payload = await getPayloadClient()
    const doc = await payload.create({
      collection: 'contact-submissions',
      data: { ...data, locale: isLocale(data.locale) ? data.locale : 'es', consentAt: new Date().toISOString() },
      overrideAccess: true,
    })

    const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
    const to = settings.notifyEmail || settings.email
    const key = process.env.RESEND_API_KEY
    if (key && to) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM_EMAIL || 'Sitio MSA <web@msaconsultores.com>',
          to: [to],
          reply_to: data.email,
          subject: `Nuevo mensaje del sitio: ${data.name}${data.service ? ` · ${data.service}` : ''}`,
          text: [
            `Nombre: ${data.name}`,
            `Correo: ${data.email}`,
            data.phone && `Teléfono: ${data.phone}`,
            data.company && `Empresa: ${data.company}`,
            data.service && `Servicio: ${data.service}`,
            `Idioma del sitio: ${data.locale}`,
            '',
            data.message,
          ]
            .filter((l) => l !== '' && l !== undefined && l !== null)
            .join('\n'),
        }),
      })
      if (res.ok) {
        await payload.update({
          collection: 'contact-submissions',
          id: doc.id,
          data: { emailSent: true },
          overrideAccess: true,
        })
      }
    }
    return { status: 'ok' }
  } catch (err) {
    console.error('[contacto]', err)
    return { status: 'error' }
  }
}
