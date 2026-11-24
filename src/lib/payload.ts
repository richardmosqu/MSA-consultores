import 'server-only'
import config from '@payload-config'
import { cache } from 'react'
import { getPayload, type Where } from 'payload'
import type { Locale } from '@/i18n/config'
import type { Page, Post, Service, SiteSetting, Team, Testimonial } from '@/payload-types'

export const getPayloadClient = () => getPayload({ config })

// Todas las consultas del front pasan por aquí. `cache` evita repetirlas
// dentro del mismo render (layout + página).

export const getSettings = cache(async (locale: Locale): Promise<SiteSetting> => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site-settings', locale, depth: 0 })
})

export const getPageBySlug = cache(async (slug: string, locale: Locale): Promise<Page | null> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
    locale,
    depth: 2,
    limit: 1,
  })
  return docs[0] ?? null
})

export const getServices = cache(
  async (locale: Locale, opts: { onlyFeatured?: boolean } = {}): Promise<Service[]> => {
    const payload = await getPayloadClient()
    const where: Where = opts.onlyFeatured ? { featured: { equals: true } } : {}
    const { docs } = await payload.find({
      collection: 'services',
      where,
      locale,
      depth: 1,
      limit: 50,
      sort: 'order',
    })
    return docs
  },
)

export const getServiceBySlug = cache(async (slug: string, locale: Locale): Promise<Service | null> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'services',
    where: { slug: { equals: slug } },
    locale,
    depth: 1,
    limit: 1,
  })
  return docs[0] ?? null
})

export const getTeam = cache(async (locale: Locale, limit = 0): Promise<Team[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'team',
    locale,
    depth: 1,
    limit: limit || 100,
    sort: 'order',
  })
  return docs
})

export const getPosts = cache(
  async (locale: Locale, opts: { category?: string; limit?: number } = {}): Promise<Post[]> => {
    const payload = await getPayloadClient()
    const where: Where = { _status: { equals: 'published' } }
    if (opts.category && opts.category !== 'all') where.category = { equals: opts.category }
    const { docs } = await payload.find({
      collection: 'posts',
      where,
      locale,
      depth: 1,
      limit: opts.limit ?? 24,
      sort: '-publishedAt',
    })
    return docs
  },
)

export const getPostBySlug = cache(async (slug: string, locale: Locale): Promise<Post | null> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
    locale,
    depth: 2,
    limit: 1,
  })
  return docs[0] ?? null
})

export const getTestimonials = cache(async (locale: Locale): Promise<Testimonial[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'testimonials', locale, depth: 1, limit: 12 })
  return docs
})
