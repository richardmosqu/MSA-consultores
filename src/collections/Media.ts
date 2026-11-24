import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '../access'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Imagen', plural: 'Imágenes' },
  admin: { group: 'Contenido' },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'alt',
      label: 'Texto alternativo',
      type: 'text',
      localized: true,
      admin: {
        description: 'Describe la imagen para personas que usan lector de pantalla y para Google.',
      },
    },
  ],
  upload: {
    mimeTypes: ['image/*'],
    focalPoint: true,
    imageSizes: [
      { name: 'thumb', width: 480, height: 480, position: 'centre' },
      { name: 'card', width: 960, height: 720, position: 'centre' },
      { name: 'portrait', width: 800, height: 1000, position: 'top' },
      { name: 'wide', width: 1920, height: undefined },
    ],
    formatOptions: { format: 'webp', options: { quality: 82 } },
  },
}
