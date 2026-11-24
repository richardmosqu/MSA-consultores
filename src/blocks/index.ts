import type { Block, Field } from 'payload'
import { highlightTitle, linkField, serviceIconOptions } from '../fields'
import { postCategories } from '../collections/Posts'

// Bloques del "builder" (Propuesta 3): MSA arma Inicio, Nosotros y páginas nuevas
// combinando estas piezas. Cada bloque tiene su componente en src/components/blocks.

const eyebrow: Field = { name: 'eyebrow', label: 'Antetítulo', type: 'text', localized: true }
const intro: Field = { name: 'intro', label: 'Introducción', type: 'textarea', localized: true }
const theme: Field = {
  name: 'theme',
  label: 'Fondo',
  type: 'select',
  defaultValue: 'light',
  options: [
    { label: 'Blanco', value: 'light' },
    { label: 'Gris azulado', value: 'mist' },
    { label: 'Azul noche', value: 'dark' },
  ],
}

export const HeroBlock: Block = {
  slug: 'hero',
  labels: { singular: 'Portada (hero)', plural: 'Portadas' },
  fields: [
    eyebrow,
    highlightTitle('title'),
    { name: 'subtitle', label: 'Subtítulo', type: 'textarea', localized: true },
    linkField('primary', 'Botón principal'),
    linkField('secondary', 'Botón secundario'),
    { name: 'image', label: 'Imagen o foto del equipo', type: 'upload', relationTo: 'media' },
    {
      name: 'size',
      label: 'Tamaño',
      type: 'select',
      defaultValue: 'large',
      options: [
        { label: 'Grande (inicio)', value: 'large' },
        { label: 'Compacto (páginas internas)', value: 'compact' },
      ],
    },
  ],
}

export const StatsBlock: Block = {
  slug: 'stats',
  labels: { singular: 'Cifras', plural: 'Cifras' },
  fields: [
    {
      name: 'items',
      label: 'Cifras',
      type: 'array',
      minRows: 1,
      maxRows: 4,
      fields: [
        { name: 'value', label: 'Valor (ej. 25+)', type: 'text', required: true },
        { name: 'label', label: 'Etiqueta', type: 'text', localized: true, required: true },
      ],
    },
  ],
}

export const ServicesGridBlock: Block = {
  slug: 'servicesGrid',
  labels: { singular: 'Servicios (grilla)', plural: 'Servicios (grilla)' },
  fields: [
    eyebrow,
    highlightTitle('title', false),
    intro,
    { name: 'onlyFeatured', label: 'Solo destacados', type: 'checkbox', defaultValue: true },
    {
      name: 'variant',
      label: 'Formato',
      type: 'select',
      defaultValue: 'cards',
      options: [
        { label: 'Tarjetas con descripción', value: 'cards' },
        { label: 'Botones con el nombre del área', value: 'chips' },
      ],
    },
    theme,
  ],
}

export const DepartmentsBlock: Block = {
  slug: 'departments',
  labels: { singular: 'Agendar por departamento', plural: 'Agendar por departamento' },
  fields: [
    eyebrow,
    highlightTitle('title', false),
    intro,
    {
      name: 'action',
      label: 'Cada botón',
      type: 'select',
      defaultValue: 'booking',
      options: [
        { label: 'Abre la agenda de ese departamento', value: 'booking' },
        { label: 'Abre WhatsApp con ese departamento', value: 'whatsapp' },
      ],
    },
    theme,
  ],
}

export const ContentBlock: Block = {
  slug: 'content',
  labels: { singular: 'Texto', plural: 'Textos' },
  fields: [eyebrow, highlightTitle('title', false), { name: 'body', label: 'Texto', type: 'richText', localized: true }, theme],
}

export const ImageTextBlock: Block = {
  slug: 'imageText',
  labels: { singular: 'Imagen + texto', plural: 'Imagen + texto' },
  fields: [
    eyebrow,
    highlightTitle('title', false),
    { name: 'body', label: 'Texto', type: 'richText', localized: true },
    { name: 'image', label: 'Imagen', type: 'upload', relationTo: 'media' },
    {
      name: 'imagePosition',
      label: 'Imagen a la',
      type: 'select',
      defaultValue: 'right',
      options: [
        { label: 'Derecha', value: 'right' },
        { label: 'Izquierda', value: 'left' },
      ],
    },
    linkField('link', 'Botón'),
    theme,
  ],
}

export const FeaturesBlock: Block = {
  slug: 'features',
  labels: { singular: 'Tarjetas con ícono', plural: 'Tarjetas con ícono' },
  fields: [
    eyebrow,
    highlightTitle('title', false),
    intro,
    {
      name: 'items',
      label: 'Tarjetas',
      type: 'array',
      fields: [
        { name: 'icon', label: 'Ícono', type: 'select', options: serviceIconOptions, defaultValue: 'shield' },
        { name: 'title', label: 'Título', type: 'text', localized: true, required: true },
        { name: 'text', label: 'Texto', type: 'textarea', localized: true },
      ],
    },
    theme,
  ],
}

export const TimelineBlock: Block = {
  slug: 'timeline',
  labels: { singular: 'Línea de tiempo', plural: 'Líneas de tiempo' },
  fields: [
    eyebrow,
    highlightTitle('title', false),
    {
      name: 'items',
      label: 'Hitos',
      type: 'array',
      fields: [
        { name: 'year', label: 'Año', type: 'text', required: true },
        { name: 'title', label: 'Título', type: 'text', localized: true, required: true },
        { name: 'text', label: 'Texto', type: 'textarea', localized: true },
      ],
    },
    theme,
  ],
}

export const TeamGridBlock: Block = {
  slug: 'teamGrid',
  labels: { singular: 'Equipo (grilla)', plural: 'Equipo (grilla)' },
  fields: [
    eyebrow,
    highlightTitle('title', false),
    intro,
    { name: 'limit', label: 'Cuántas personas (0 = todas)', type: 'number', defaultValue: 4 },
    theme,
  ],
}

export const LatestPostsBlock: Block = {
  slug: 'latestPosts',
  labels: { singular: 'Últimas publicaciones', plural: 'Últimas publicaciones' },
  fields: [
    eyebrow,
    highlightTitle('title', false),
    {
      name: 'category',
      label: 'Categoría',
      type: 'select',
      options: [{ label: 'Todas', value: 'all' }, ...postCategories.map((c) => ({ ...c }))],
      defaultValue: 'all',
    },
    { name: 'limit', label: 'Cuántas', type: 'number', defaultValue: 3 },
    theme,
  ],
}

export const TestimonialsBlock: Block = {
  slug: 'testimonials',
  labels: { singular: 'Testimonios', plural: 'Testimonios' },
  fields: [
    eyebrow,
    highlightTitle('title', false),
    {
      name: 'items',
      label: 'Testimonios (vacío = todos)',
      type: 'relationship',
      relationTo: 'testimonials',
      hasMany: true,
    },
    theme,
  ],
}

export const FaqBlock: Block = {
  slug: 'faq',
  labels: { singular: 'Preguntas frecuentes', plural: 'Preguntas frecuentes' },
  fields: [
    eyebrow,
    highlightTitle('title', false),
    {
      name: 'items',
      label: 'Preguntas',
      type: 'array',
      fields: [
        { name: 'question', label: 'Pregunta', type: 'text', localized: true, required: true },
        { name: 'answer', label: 'Respuesta', type: 'textarea', localized: true, required: true },
      ],
    },
    theme,
  ],
}

export const CtaBlock: Block = {
  slug: 'cta',
  labels: { singular: 'Llamado a la acción', plural: 'Llamados a la acción' },
  fields: [
    highlightTitle('title'),
    { name: 'text', label: 'Texto', type: 'textarea', localized: true },
    linkField('primary', 'Botón principal'),
    linkField('secondary', 'Botón secundario'),
  ],
}

export const pageBlocks: Block[] = [
  HeroBlock,
  StatsBlock,
  ServicesGridBlock,
  DepartmentsBlock,
  ContentBlock,
  ImageTextBlock,
  FeaturesBlock,
  TimelineBlock,
  TeamGridBlock,
  LatestPostsBlock,
  TestimonialsBlock,
  FaqBlock,
  CtaBlock,
]
