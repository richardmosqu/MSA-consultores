import type { Metadata } from 'next'
import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { HeroBlock } from '@/components/blocks/Hero'
import { getPageBySlug } from '@/lib/payload'
import { pageMetadata } from '@/lib/seo'
import { getSite } from '@/lib/site'

export async function generateMetadata({ params }: PageProps<'/[locale]'>): Promise<Metadata> {
  const site = await getSite((await params).locale)
  const page = await getPageBySlug('inicio', site.locale)
  return pageMetadata({
    locale: site.locale,
    title: site.dict.meta.defaultTitle,
    description: site.dict.meta.defaultDescription,
    meta: page?.meta,
  })
}

export default async function HomePage({ params }: PageProps<'/[locale]'>) {
  const site = await getSite((await params).locale)
  const page = await getPageBySlug('inicio', site.locale)

  if (!page?.layout?.length) {
    // Respaldo mientras no exista la página "inicio" en el panel.
    return (
      <HeroBlock
        site={site}
        first
        block={{
          blockType: 'hero',
          eyebrow: site.dict.brand.tagline,
          title: 'MSA *Consultores*',
          subtitle: site.dict.meta.defaultDescription,
          primary: { type: 'booking' },
          secondary: { type: 'whatsapp' },
        }}
      />
    )
  }

  return <RenderBlocks blocks={page.layout} site={site} />
}
