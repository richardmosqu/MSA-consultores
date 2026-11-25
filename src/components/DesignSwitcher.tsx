'use client'

import { useSyncExternalStore } from 'react'

// Selector de propuesta para la revisión con MSA. Solo aparece en "modo revisión":
// al abrir el sitio con ?diseno=cercana o ?diseno=editorial (y desaparece con ?diseno=reset).
export const DESIGNS = [
  { id: 'cercana', label: 'B · Cercana' },
  { id: 'editorial', label: 'C · Editorial' },
] as const

const KEY = 'msa-design'
const listeners = new Set<() => void>()

/** Script que corre antes de pintar la página: aplica la propuesta guardada o la del enlace. */
export const designScript = `(function(){try{var k='${KEY}',p=new URLSearchParams(location.search).get('diseno');if(p==='cercana'||p==='editorial')localStorage.setItem(k,p);else if(p==='reset')localStorage.removeItem(k);var d=localStorage.getItem(k);if(d)document.documentElement.setAttribute('data-design',d)}catch(e){}})()`

function subscribe(cb: () => void) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}
function getSnapshot() {
  try {
    return localStorage.getItem(KEY)
  } catch {
    return null
  }
}

function choose(id: string) {
  try {
    localStorage.setItem(KEY, id)
  } catch {}
  document.documentElement.setAttribute('data-design', id)
  listeners.forEach((l) => l())
}

export function DesignSwitcher() {
  const current = useSyncExternalStore(subscribe, getSnapshot, () => null)
  if (!current) return null
  return (
    <div className="fixed bottom-4 left-4 z-[70] flex items-center gap-1 bg-ink p-1 text-xs text-white shadow-2xl sm:bottom-6 sm:left-6 rounded-dot">
      <span className="px-3 font-semibold text-white/60">Propuesta</span>
      {DESIGNS.map((d) => (
        <button
          key={d.id}
          type="button"
          onClick={() => choose(d.id)}
          aria-pressed={current === d.id}
          className={`rounded-dot px-3 py-2 font-semibold transition ${current === d.id ? 'bg-white text-ink' : 'hover:bg-white/10'}`}
        >
          {d.label}
        </button>
      ))}
    </div>
  )
}
