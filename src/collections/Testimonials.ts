import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '../access'
import { revalidateSite } from '../lib/revalidate'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: { singular: 'Testimonio', plural: 'Testimonios' },
  admin: { useAsTitle: 'author', defaultColumns: ['author', 'company'], group: 'Contenido' },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  hooks: { afterChange: [revalidateSite], afterDelete: [revalidateSite] },
  fields: [
    { name: 'quote', label: 'Testimonio', type: 'textarea', localized: true, required: true },
    { name: 'author', label: 'Nombre', type: 'text', required: true },
    { name: 'position', label: 'Cargo', type: 'text', localized: true },
    { name: 'company', label: 'Empresa', type: 'text' },
    { name: 'logo', label: 'Logo de la empresa', type: 'upload', relationTo: 'media' },
  ],
}
