import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '../access'
import { serviceIconOptions, slugField } from '../fields'
import { revalidateSite } from '../lib/revalidate'

export const Services: CollectionConfig = {
  slug: 'services',
  labels: { singular: 'Servicio', plural: 'Servicios' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'order', 'featured', 'updatedAt'],
    group: 'Contenido',
  },
  defaultSort: 'order',
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  hooks: { afterChange: [revalidateSite], afterDelete: [revalidateSite] },
  fields: [
    { name: 'title', label: 'Nombre del servicio', type: 'text', localized: true, required: true },
    {
      name: 'summary',
      label: 'Resumen (tarjetas y buscadores)',
      type: 'textarea',
      localized: true,
      maxLength: 240,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Contenido',
          fields: [
            { name: 'body', label: 'Descripción', type: 'richText', localized: true },
            {
              name: 'features',
              label: 'Qué incluye',
              type: 'array',
              labels: { singular: 'Punto', plural: 'Puntos' },
              fields: [{ name: 'text', label: 'Texto', type: 'text', localized: true, required: true }],
            },
            {
              name: 'faq',
              label: 'Preguntas frecuentes',
              type: 'array',
              labels: { singular: 'Pregunta', plural: 'Preguntas' },
              fields: [
                { name: 'question', label: 'Pregunta', type: 'text', localized: true, required: true },
                { name: 'answer', label: 'Respuesta', type: 'textarea', localized: true, required: true },
              ],
            },
          ],
        },
        {
          label: 'Agenda y WhatsApp',
          fields: [
            {
              name: 'bookingUrl',
              label: 'Enlace de agenda en Tilín para este servicio',
              type: 'text',
              admin: {
                description:
                  'Opcional. Si se deja vacío, el botón "Agendar" usa el enlace general de Ajustes del sitio.',
              },
            },
            {
              name: 'whatsappMessage',
              label: 'Mensaje precargado de WhatsApp',
              type: 'text',
              localized: true,
              admin: { description: 'Opcional. Por defecto: "Hola MSA, me interesa el servicio de …"' },
            },
          ],
        },
      ],
    },
    slugField(),
    {
      name: 'icon',
      label: 'Ícono',
      type: 'select',
      options: serviceIconOptions,
      defaultValue: 'shield',
      admin: { position: 'sidebar' },
    },
    { name: 'image', label: 'Imagen', type: 'upload', relationTo: 'media', admin: { position: 'sidebar' } },
    {
      name: 'order',
      label: 'Orden',
      type: 'number',
      defaultValue: 10,
      admin: { position: 'sidebar', description: 'Menor = aparece primero' },
    },
    {
      name: 'featured',
      label: 'Destacado en inicio',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
  ],
}
