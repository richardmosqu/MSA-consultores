import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '../access'
import { revalidateSite } from '../lib/revalidate'

// Grupos de la página de equipo (Presidencia / VP, Gerencias, Consultores, RRHH…),
// cada uno con su descripción, tal como vienen en el Excel de MSA.
export const TeamGroups: CollectionConfig = {
  slug: 'team-groups',
  labels: { singular: 'Grupo del equipo', plural: 'Grupos del equipo' },
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'order'], group: 'Contenido' },
  defaultSort: 'order',
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  hooks: { afterChange: [revalidateSite], afterDelete: [revalidateSite] },
  fields: [
    { name: 'name', label: 'Nombre', type: 'text', localized: true, required: true },
    { name: 'description', label: 'Descripción', type: 'textarea', localized: true },
    { name: 'order', label: 'Orden', type: 'number', defaultValue: 10, admin: { position: 'sidebar' } },
  ],
}
