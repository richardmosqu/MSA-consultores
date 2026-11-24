import es, { type Dictionary } from './dictionaries/es'
import en from './dictionaries/en'
import pt from './dictionaries/pt'
import it from './dictionaries/it'
import type { Locale } from './config'

export * from './config'
export type { Dictionary }

const dictionaries: Record<Locale, Dictionary> = { es, en, pt, it }

export const getDictionary = (locale: Locale): Dictionary => dictionaries[locale]

/** Reemplaza {clave} en un texto: fill('Agendar con {name}', { name: 'Ana' }) */
export const fill = (text: string, values: Record<string, string>) =>
  text.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? '')
