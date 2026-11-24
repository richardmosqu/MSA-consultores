import type { Field, FieldHook } from 'payload'
import { routeSegments } from '../i18n/config'

export const slugify = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const formatSlug =
  (from: string): FieldHook =>
  ({ value, data, originalDoc }) => {
    if (typeof value === 'string' && value.length > 0) return slugify(value)
    const source = data?.[from] ?? originalDoc?.[from]
    // Con campos localizados, el título puede llegar como texto del idioma actual.
    if (typeof source === 'string') return slugify(source)
    return value
  }

/** Slug único, se arma solo a partir del título si se deja vacío. */
export const slugField = (from = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  label: 'Slug (URL)',
  unique: true,
  index: true,
  admin: {
    position: 'sidebar',
    description: 'Se genera a partir del título en español. Cámbialo solo si sabes lo que haces.',
  },
  hooks: { beforeValidate: [formatSlug(from)] },
})

/** Título con palabras destacadas: lo que va entre *asteriscos* se pinta en azul eléctrico. */
export const highlightTitle = (name = 'title', required = true): Field => ({
  name,
  type: 'text',
  localized: true,
  required,
  admin: {
    description: 'Lo que escribas entre *asteriscos* se resalta en azul. Ej.: Tu empresa en *orden*',
  },
})

const routeLabels: Record<keyof typeof routeSegments, string> = {
  nosotros: 'Nosotros',
  equipo: 'Equipo',
  servicios: 'Servicios',
  'casos-de-exito': 'Casos de éxito',
  'cultura-msa': 'Cultura MSA',
  blog: 'Blog / alertas',
  contacto: 'Contacto',
  privacidad: 'Privacidad',
}

export const internalRouteOptions = [
  { label: 'Inicio', value: 'inicio' },
  ...(Object.keys(routeSegments) as (keyof typeof routeSegments)[]).map((key) => ({
    label: routeLabels[key],
    value: key,
  })),
]

/** Botón/enlace reutilizable: agenda (Tilín), WhatsApp, sección del sitio o URL. */
export const linkField = (name = 'link', label = 'Botón'): Field => ({
  name,
  label,
  type: 'group',
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'type',
          label: 'Acción',
          type: 'select',
          defaultValue: 'booking',
          options: [
            { label: 'Agendar cita', value: 'booking' },
            { label: 'Abrir WhatsApp', value: 'whatsapp' },
            { label: 'Sección del sitio', value: 'internal' },
            { label: 'URL', value: 'custom' },
            { label: 'Sin botón', value: 'none' },
          ],
        },
        { name: 'label', label: 'Texto', type: 'text', localized: true },
      ],
    },
    {
      name: 'route',
      label: 'Sección',
      type: 'select',
      options: internalRouteOptions,
      admin: { condition: (_, sibling) => sibling?.type === 'internal' },
    },
    {
      name: 'url',
      label: 'URL',
      type: 'text',
      admin: { condition: (_, sibling) => sibling?.type === 'custom' },
    },
  ],
})

export const serviceIconOptions = [
  { label: 'Impuestos', value: 'tax' },
  { label: 'Contabilidad', value: 'accounting' },
  { label: 'Laboral', value: 'labor' },
  { label: 'Finanzas', value: 'finance' },
  { label: 'Talento / RRHH', value: 'talent' },
  { label: 'Auditoría', value: 'audit' },
  { label: 'Legal', value: 'legal' },
  { label: 'Cumplimiento', value: 'compliance' },
  { label: 'Escudo', value: 'shield' },
  { label: 'Edificio', value: 'building' },
  { label: 'Calendario', value: 'calendar' },
  { label: 'Mundo', value: 'globe' },
]
