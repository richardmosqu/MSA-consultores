import { postgresAdapter } from '@payloadcms/db-postgres'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { en } from '@payloadcms/translations/languages/en'
import { es } from '@payloadcms/translations/languages/es'
import path from 'path'
import { buildConfig, type Field } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { ContactSubmissions } from './collections/ContactSubmissions'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Services } from './collections/Services'
import { Team } from './collections/Team'
import { TeamGroups } from './collections/TeamGroups'
import { Testimonials } from './collections/Testimonials'
import { Users } from './collections/Users'
import { SiteSettings } from './globals/SiteSettings'
import { defaultLocale, localeLabels, locales } from './i18n/config'
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

// Archivos en un bucket S3 compatible (Cloudflare R2) si hay credenciales;
// si no (desarrollo local), en disco.
const useS3 = Boolean(process.env.S3_BUCKET && process.env.S3_ACCESS_KEY_ID)

export default buildConfig({
  serverURL,
  admin: {
    user: Users.slug,
    meta: { titleSuffix: ' · Panel MSA' },
    importMap: { baseDir: path.resolve(dirname) },
    livePreview: {
      breakpoints: [
        { label: 'Móvil', name: 'mobile', width: 390, height: 844 },
        { label: 'Tablet', name: 'tablet', width: 820, height: 1180 },
        { label: 'Escritorio', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  i18n: {
    supportedLanguages: { es, en },
    fallbackLanguage: 'es',
  },
  localization: {
    locales: locales.map((code) => ({ code, label: localeLabels[code] })),
    defaultLocale,
    fallback: true,
  },
  collections: [
    Pages,
    Services,
    Team,
    TeamGroups,
    Posts,
    Testimonials,
    Media,
    ContactSubmissions,
    Users,
  ],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || '' },
    migrationDir: path.resolve(dirname, 'migrations'),
    // En producción (Railway) las migraciones corren solas al arrancar.
    prodMigrations: migrations,
  }),
  sharp,
  plugins: [
    seoPlugin({
      collections: ['pages', 'posts', 'services'],
      uploadsCollection: 'media',
      tabbedUI: false,
      fields: ({ defaultFields }) =>
        defaultFields.map((field) =>
          'name' in field && (field.name === 'title' || field.name === 'description')
            ? ({ ...field, localized: true } as Field)
            : field,
        ),
      generateTitle: ({ doc }) => `${(doc as { title?: string })?.title ?? ''} · MSA Consultores`,
      generateDescription: ({ doc }) =>
        (doc as { summary?: string; excerpt?: string })?.summary ??
        (doc as { excerpt?: string })?.excerpt ??
        '',
    }),
    s3Storage({
      enabled: useS3,
      collections: { media: true },
      bucket: process.env.S3_BUCKET || '',
      config: {
        endpoint: process.env.S3_ENDPOINT,
        region: process.env.S3_REGION || 'auto',
        forcePathStyle: true,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
      },
    }),
  ],
})
