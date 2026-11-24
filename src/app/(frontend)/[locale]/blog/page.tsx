import type { Metadata } from 'next'
import { PostCard } from '@/components/Cards'
import { PageHeader } from '@/components/PageHeader'
import { getPosts } from '@/lib/payload'
import { pageMetadata } from '@/lib/seo'
import { getSite } from '@/lib/site'
import { Suspense } from 'react'
import { BlogFilter, BlogFilterView } from './BlogFilter'

const categories = ['all', 'noticias', 'articulos', 'actividades'] as const

export async function generateMetadata({ params }: PageProps<'/[locale]/blog'>): Promise<Metadata> {
  const site = await getSite((await params).locale)
  return pageMetadata({ locale: site.locale, route: 'blog', title: site.dict.blog.eyebrow, description: site.dict.blog.intro })
}

export default async function BlogPage({ params }: PageProps<'/[locale]/blog'>) {
  const site = await getSite((await params).locale)
  const posts = await getPosts(site.locale, { limit: 60 })
  const { dict } = site
  const filterProps = {
    label: dict.blog.eyebrow,
    empty: dict.blog.empty,
    categories: categories.map((value) => ({ value, label: dict.blog.categories[value] })),
    items: posts.map((p) => ({
      id: p.id,
      category: p.category,
      node: <PostCard post={p} locale={site.locale} dict={dict} />,
    })),
  }

  return (
    <>
      <PageHeader
        breadcrumbs={[{ href: `/${site.locale}`, label: dict.common.home }, { label: dict.nav.blog }]}
        eyebrow={dict.blog.eyebrow}
        title={dict.blog.title}
        intro={dict.blog.intro}
      />
      <section className="bg-white py-14 sm:py-20">
        <div className="container-site">
          <Suspense fallback={<BlogFilterView {...filterProps} />}>
            <BlogFilter {...filterProps} />
          </Suspense>
        </div>
      </section>
    </>
  )
}
