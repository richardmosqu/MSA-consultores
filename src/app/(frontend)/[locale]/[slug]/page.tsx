import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { routeSegments, type RouteKey } from '@/i18n/config'
import { getPageBySlug } from '@/lib/payload'
import { pageMetadata } from '@/lib/seo'
import { getSite } from '@/lib/site'

// Páginas del builder: Nosotros, Casos de éxito, Cultura MSA, Privacidad y las que MSA cree.
export const generateStaticParams = async () => []

const routeFor = (slug: string): { route: RouteKey | ''; rest: string[] } =>
  slug in routeSegments ? { route: slug as RouteKey, rest: [] } : { route: '', rest: [slug] }

export async function generateMetadata({ params }: PageProps<'/[locale]/[slug]'>): Promise<Metadata> {
  const { locale, slug } = await params
  const site = await getSite(locale)
  const page = await getPageBySlug(slug, site.locale)
  if (!page) return {}
  return pageMetadata({ locale: site.locale, ...routeFor(slug), title: page.title, meta: page.meta })
}

export default async function BuilderPage({ params }: PageProps<'/[locale]/[slug]'>) {
  const { locale, slug } = await params
  const site = await getSite(locale)
  if (slug === 'inicio') notFound()
  const page = await getPageBySlug(slug, site.locale)
  if (!page) notFound()
  const crumbs = [{ href: `/${site.locale}`, label: site.dict.common.home }, { label: page.title }]
  return <RenderBlocks blocks={page.layout} site={site} breadcrumbs={crumbs} />
}
