'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { Icon } from './Icon'

// El botón flotante vive en el layout; cada página puede cambiar el mensaje precargado
// (servicio, persona del equipo, artículo) con <WhatsAppMessage message="…" />.

type Ctx = { number: string; message: string; setMessage: (m: string | null) => void }
const WhatsAppContext = createContext<Ctx | null>(null)

export function WhatsAppProvider({
  number,
  defaultMessage,
  children,
}: {
  number?: string | null
  defaultMessage: string
  children: React.ReactNode
}) {
  const [override, setOverride] = useState<string | null>(null)
  return (
    <WhatsAppContext.Provider
      value={{ number: (number ?? '').replace(/\D/g, ''), message: override ?? defaultMessage, setMessage: setOverride }}
    >
      {children}
    </WhatsAppContext.Provider>
  )
}

export function WhatsAppMessage({ message }: { message: string }) {
  const ctx = useContext(WhatsAppContext)
  useEffect(() => {
    ctx?.setMessage(message)
    return () => ctx?.setMessage(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message])
  return null
}

export function WhatsAppFloat({ label }: { label: string }) {
  const ctx = useContext(WhatsAppContext)
  if (!ctx?.number) return null
  const url = `https://wa.me/${ctx.number}?text=${encodeURIComponent(ctx.message)}`
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group fixed right-4 bottom-4 z-40 flex items-center gap-3 sm:right-6 sm:bottom-6"
      data-track="whatsapp-float"
    >
      <span className="pointer-events-none hidden translate-x-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-ink opacity-0 shadow-lg transition group-hover:translate-x-0 group-hover:opacity-100 md:block">
        {label}
      </span>
      <span className="grid size-14 place-items-center rounded-full bg-whatsapp text-ink shadow-[0_12px_30px_-8px_rgba(37,211,102,0.8)] transition group-hover:scale-105">
        <Icon name="whatsapp" className="size-7" />
      </span>
    </a>
  )
}
