import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '../access'
import { slugField } from '../fields'
import { revalidateSite } from '../lib/revalidate'

export const Team: CollectionConfig = {
  slug: 'team',
  labels: { singular: 'Persona del equipo', plural: 'Equipo' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'group', 'order'],
    group: 'Contenido',
  },
  defaultSort: 'order',
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  hooks: { afterChange: [revalidateSite], afterDelete: [revalidateSite] },
  fields: [
    { name: 'name', label: 'Nombre', type: 'text', required: true },
    { name: 'role', label: 'Cargo', type: 'text', localized: true, required: true },
    {
      name: 'group',
      label: 'Grupo',
      type: 'relationship',
      relationTo: 'team-groups',
      admin: { description: 'Presidencia / VP, Gerencias, Consultores, RRHH, Legal…' },
    },
    { name: 'bio', label: 'Presentación corta', type: 'textarea', localized: true, maxLength: 400 },
    {
      name: 'specialties',
      label: 'Especialidades',
      type: 'array',
      fields: [{ name: 'text', label: 'Especialidad', type: 'text', localized: true, required: true }],
    },
    slugField('name'),
    { name: 'photo', label: 'Foto', type: 'upload', relationTo: 'media', admin: { position: 'sidebar' } },
    {
      name: 'languages',
      label: 'Idiomas que habla',
      type: 'select',
      hasMany: true,
      defaultValue: ['es'],
      options: [
        { label: 'Español', value: 'es' },
        { label: 'Inglés', value: 'en' },
        { label: 'Portugués', value: 'pt' },
        { label: 'Italiano', value: 'it' },
        { label: 'Francés', value: 'fr' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'linkedin', label: 'LinkedIn (URL)', type: 'text', admin: { position: 'sidebar' } },
    {
      name: 'bookingUrl',
      label: 'Enlace de agenda personal (Tilín)',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Cuando Tilín tenga "varios profesionales". Vacío = agenda general.',
      },
    },
    { name: 'order', label: 'Orden', type: 'number', defaultValue: 10, admin: { position: 'sidebar' } },
  ],
}
