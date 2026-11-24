import type { CollectionConfig } from 'payload'
import { authenticated, publishedOrAuthenticated } from '../access'
import { slugField } from '../fields'
import { revalidateSite } from '../lib/revalidate'

export const postCategories = [
  { label: 'Artículos', value: 'articulos' },
  { label: 'Alertas y noticias', value: 'noticias' },
  { label: 'Actividades del equipo', value: 'actividades' },
] as const

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Publicación', plural: 'Blog y actividades' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedAt', '_status'],
    group: 'Contenido',
  },
  defaultSort: '-publishedAt',
  access: {
    read: publishedOrAuthenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  versions: { drafts: { autosave: { interval: 1500 } }, maxPerDoc: 30 },
  hooks: { afterChange: [revalidateSite], afterDelete: [revalidateSite] },
  fields: [
    { name: 'title', label: 'Título', type: 'text', localized: true, required: true },
    {
      name: 'excerpt',
      label: 'Resumen',
      type: 'textarea',
      localized: true,
      maxLength: 280,
    },
    { name: 'content', label: 'Contenido', type: 'richText', localized: true },
    {
      name: 'gallery',
      label: 'Galería (actividades)',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
    },
    slugField(),
    {
      name: 'category',
      label: 'Categoría',
      type: 'select',
      required: true,
      defaultValue: 'articulos',
      options: postCategories.map((c) => ({ ...c })),
      admin: { position: 'sidebar' },
    },
    { name: 'cover', label: 'Portada', type: 'upload', relationTo: 'media', admin: { position: 'sidebar' } },
    {
      name: 'author',
      label: 'Autor(a)',
      type: 'relationship',
      relationTo: 'team',
      admin: { position: 'sidebar' },
    },
    {
      name: 'relatedService',
      label: 'Servicio relacionado',
      type: 'relationship',
      relationTo: 'services',
      admin: { position: 'sidebar', description: 'Muestra un botón para agendar ese servicio.' },
    },
    {
      name: 'publishedAt',
      label: 'Fecha de publicación',
      type: 'date',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } },
      hooks: {
        beforeChange: [
          ({ value, siblingData }) =>
            value ?? (siblingData?._status === 'published' ? new Date().toISOString() : value),
        ],
      },
    },
  ],
}
