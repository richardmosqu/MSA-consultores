import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminField, isAdminOrSelf } from '../access'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Usuario', plural: 'Usuarios' },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'role'],
    group: 'Ajustes',
  },
  auth: true,
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: isAdminOrSelf,
    update: isAdminOrSelf,
  },
  hooks: {
    beforeChange: [
      // El primer usuario que se crea es administrador.
      async ({ req, operation, data }) => {
        if (operation === 'create') {
          const { totalDocs } = await req.payload.count({ collection: 'users', req })
          if (totalDocs === 0) data.role = 'admin'
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'name', label: 'Nombre', type: 'text' },
    {
      name: 'role',
      label: 'Rol',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      saveToJWT: true,
      access: { update: isAdminField },
      options: [
        { label: 'Administrador (todo, incluidos usuarios y ajustes)', value: 'admin' },
        { label: 'Editor (contenido)', value: 'editor' },
      ],
    },
  ],
}
