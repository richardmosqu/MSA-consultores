import type { CollectionConfig } from 'payload'
import { authenticated, publishedOrAuthenticated } from '../access'
import { pageBlocks } from '../blocks'
import { slugField } from '../fields'
import { revalidateSite } from '../lib/revalidate'

// Páginas armadas por bloques. Slugs reservados:
//   inicio     → portada del sitio (/es, /en…)
//   nosotros   → /es/nosotros, /en/about…
//   privacidad → /es/privacidad, /en/privacy…
// Cualquier otro slug se publica en /<idioma>/<slug>.
export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Página', plural: 'Páginas' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    group: 'Contenido',
  },
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
      name: 'layout',
      label: 'Bloques',
      type: 'blocks',
      localized: false,
      blocks: pageBlocks,
      admin: { initCollapsed: true },
    },
    slugField(),
  ],
}
