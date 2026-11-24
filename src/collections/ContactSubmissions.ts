import type { CollectionConfig } from 'payload'
import { authenticated, isAdmin } from '../access'

// Mensajes del formulario de contacto. Se guardan siempre (aunque falle el correo)
// y solo los ve el equipo de MSA en el panel.
export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  labels: { singular: 'Mensaje de contacto', plural: 'Mensajes de contacto' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'service', 'createdAt'],
    group: 'Contactos',
  },
  defaultSort: '-createdAt',
  access: {
    create: () => false, // solo desde el servidor (server action)
    read: authenticated,
    update: authenticated,
    delete: isAdmin,
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', label: 'Nombre', type: 'text', required: true },
        { name: 'email', label: 'Correo', type: 'email', required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'phone', label: 'Teléfono', type: 'text' },
        { name: 'company', label: 'Empresa', type: 'text' },
      ],
    },
    { name: 'service', label: 'Servicio', type: 'text' },
    { name: 'message', label: 'Mensaje', type: 'textarea', required: true },
    {
      type: 'row',
      fields: [
        { name: 'locale', label: 'Idioma del sitio', type: 'text', admin: { readOnly: true } },
        { name: 'consentAt', label: 'Consentimiento (Ley 81)', type: 'date', admin: { readOnly: true } },
      ],
    },
    {
      name: 'status',
      label: 'Estado',
      type: 'select',
      defaultValue: 'nuevo',
      options: [
        { label: 'Nuevo', value: 'nuevo' },
        { label: 'En proceso', value: 'en-proceso' },
        { label: 'Respondido', value: 'respondido' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'emailSent',
      label: 'Aviso por correo enviado',
      type: 'checkbox',
      admin: { position: 'sidebar', readOnly: true },
    },
  ],
}
