import type { GlobalConfig } from 'payload'
import { anyone, isAdmin } from '../access'
import { serviceIconOptions } from '../fields'
import { revalidateGlobal } from '../lib/revalidate'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Ajustes del sitio',
  admin: { group: 'Ajustes' },
  access: { read: anyone, update: isAdmin },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Contacto',
          fields: [
            {
              name: 'phones',
              label: 'Teléfonos',
              type: 'array',
              fields: [{ name: 'number', label: 'Número', type: 'text', required: true }],
            },
            { name: 'email', label: 'Correo público', type: 'email' },
            {
              name: 'notifyEmail',
              label: 'Correo que recibe los mensajes del formulario',
              type: 'email',
              admin: { description: 'Si se deja vacío, se usa el correo público.' },
            },
            { name: 'officeName', label: 'Nombre de la oficina principal', type: 'text', localized: true },
            { name: 'address', label: 'Dirección', type: 'textarea', localized: true },
            { name: 'mapsUrl', label: 'Enlace de Google Maps', type: 'text' },
            { name: 'hours', label: 'Horario', type: 'text', localized: true },
            {
              name: 'offices',
              label: 'Presencia regional',
              type: 'array',
              labels: { singular: 'Sede', plural: 'Sedes' },
              fields: [
                { name: 'name', label: 'Nombre', type: 'text', localized: true, required: true },
                { name: 'text', label: 'Descripción', type: 'textarea', localized: true },
                {
                  name: 'status',
                  label: 'Estado',
                  type: 'select',
                  defaultValue: 'active',
                  options: [
                    { label: 'Activa', value: 'active' },
                    { label: 'Próximamente', value: 'soon' },
                    { label: 'Internacional', value: 'international' },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Departamentos',
          description:
            'Áreas con las que se puede agendar o hablar directamente (botones de Inicio y Contacto).',
          fields: [
            {
              name: 'departments',
              label: 'Departamentos',
              type: 'array',
              labels: { singular: 'Departamento', plural: 'Departamentos' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'name', label: 'Nombre', type: 'text', localized: true, required: true },
                    { name: 'shortName', label: 'Botón corto (ej. FISCAL)', type: 'text', localized: true },
                  ],
                },
                { name: 'description', label: 'Descripción', type: 'textarea', localized: true },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'bookingUrl',
                      label: 'Agenda en Tilín',
                      type: 'text',
                      admin: { description: 'Vacío = agenda general' },
                    },
                    {
                      name: 'whatsappNumber',
                      label: 'WhatsApp del área',
                      type: 'text',
                      admin: { description: 'Vacío = WhatsApp general' },
                    },
                    { name: 'email', label: 'Correo del área', type: 'email' },
                  ],
                },
                {
                  name: 'icon',
                  label: 'Ícono',
                  type: 'select',
                  options: serviceIconOptions,
                  defaultValue: 'shield',
                },
                {
                  name: 'showOnHome',
                  label: 'Mostrar en "Agenda según tu necesidad" (Inicio)',
                  type: 'checkbox',
                  defaultValue: true,
                },
              ],
            },
          ],
        },
        {
          label: 'WhatsApp',
          fields: [
            {
              name: 'whatsappNumber',
              label: 'Número de WhatsApp',
              type: 'text',
              admin: { description: 'Con código de país, solo números. Ej.: 50760001234' },
            },
            {
              name: 'whatsappMessage',
              label: 'Mensaje precargado general',
              type: 'text',
              localized: true,
              admin: { description: 'Opcional. Vacío = texto por defecto de cada idioma.' },
            },
          ],
        },
        {
          label: 'Agenda (Tilín)',
          fields: [
            {
              name: 'bookingMode',
              label: 'Cómo funciona "Agendar"',
              type: 'select',
              defaultValue: 'link',
              options: [
                { label: 'Enlace a la página de reservas en Tilín', value: 'link' },
                { label: 'Sección de contacto del sitio (sin agenda en línea)', value: 'contact' },
              ],
              admin: {
                description:
                  'La reserva dentro del sitio por API se activa cuando Tilín entregue las credenciales.',
              },
            },
            {
              name: 'bookingUrl',
              label: 'Enlace general de reservas',
              type: 'text',
              admin: {
                description: 'Ej.: https://agenda.msaconsultores.com',
                condition: (data) => data?.bookingMode === 'link',
              },
            },
          ],
        },
        {
          label: 'Redes',
          fields: [
            { name: 'instagram', type: 'text' },
            { name: 'linkedin', type: 'text' },
            { name: 'facebook', type: 'text' },
            { name: 'tiktok', type: 'text' },
            { name: 'youtube', type: 'text' },
          ],
        },
        {
          label: 'Analítica',
          fields: [
            {
              name: 'gaId',
              label: 'Google Analytics 4 (G-XXXXXXX)',
              type: 'text',
              admin: { description: 'Solo se carga si la persona acepta las cookies de analítica.' },
            },
          ],
        },
      ],
    },
  ],
}
