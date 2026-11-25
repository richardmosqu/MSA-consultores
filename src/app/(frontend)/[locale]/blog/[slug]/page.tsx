import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ButtonLink } from '@/components/ButtonLink'
import { MediaImage, hasMedia } from '@/components/Media'
import { PageHeader } from '@/components/PageHeader'
import { RichText } from '@/components/RichText'
import { WhatsAppMessage } from '@/components/WhatsApp'
import { fill, href } from '@/i18n'
import type { Dictionary } from '@/i18n'
import { bookingLink } from '@/lib/links'
import { getPostBySlug } from '@/lib/payload'
import { pageMetadata } from '@/lib/seo'
import { getSite } from '@/lib/site'

export const generateStaticParams = async () => []

export async function generateMetadata({ params }: PageProps<'/[locale]/blog/[slug]'>): Promise<Metadata> {
  const { locale, slug } = await params
  const site = await getSite(locale)
  const post = await getPostBySlug(slug, site.locale)
  if (!post) return {}
  return pageMetadata({
    locale: site.locale,
    route: 'blog',
    rest: [slug],
    title: post.title,
    description: post.excerpt,
    meta: post.meta ?? { image: post.cover },
  })
}

export default async function PostPage({ params }: PageProps<'/[locale]/blog/[slug]'>) {
  const { locale, slug } = await params
  const site = await getSite(locale)
  const post = await getPostBySlug(slug, site.locale)
  if (!post) notFound()
  const { dict } = site

  const date = post.publishedAt
    ? new Intl.DateTimeFormat(site.locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(post.publishedAt))
    : null
  const author = post.author && typeof post.author === 'object' ? post.author : null
  const service = post.relatedService && typeof post.relatedService === 'object' ? post.relatedService : null
  const category = dict.blog.categories[post.category as keyof Dictionary['blog']['categories']]
  const gallery = (post.gallery ?? []).filter(hasMedia)

  return (
    <article>
      <WhatsAppMessage message={fill(dict.whatsapp.post, { title: post.title })} />
      <PageHeader
        breadcrumbs={[
          { href: `/${site.locale}`, label: dict.common.home },
          { href: href(site.locale, 'blog'), label: dict.nav.blog },
          { label: post.title },
        ]}
        eyebrow={category}
        title={post.title}
        intro={post.excerpt}
      >
        <p className="mt-6 text-sm text-white/70">
          {date && (
            <>
              {dict.common.publishedOn} <time dateTime={post.publishedAt ?? undefined}>{date}</time>
            </>
          )}
          {author && (
            <>
              {' · '}
              {dict.common.by} <span className="font-semibold text-white">{author.name}</span>
            </>
          )}
        </p>
      </PageHeader>

      {hasMedia(post.cover) && (
        <div className="container-site -mt-6 sm:-mt-10">
          <div className="relative aspect-[16/8] overflow-hidden rounded-3xl shadow-2xl">
            <MediaImage media={post.cover} size="wide" priority sizes="(min-width: 1280px) 1200px, 100vw" />
          </div>
        </div>
      )}

      <div className="container-site py-14 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <RichText data={post.content} />

          {gallery.length > 0 && (
            <div className="mt-14">
              <h2 className="display-md mb-6 text-ink">{dict.common.gallery}</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {gallery.map((m) => (
                  <div key={m.id} className="relative aspect-square overflow-hidden rounded-xl">
                    <MediaImage media={m} size="card" sizes="(min-width: 640px) 33vw, 50vw" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {service && (
            <div className="mt-14 flex flex-col items-start gap-5 rounded-2xl bg-surface p-7 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-lg font-black uppercase text-ink">{service.title}</p>
              <ButtonLink
                link={bookingLink(site.settings, site.locale, service.bookingUrl)}
                label={dict.common.bookThisService}
              />
            </div>
          )}

          <p className="mt-12">
            <a href={href(site.locale, 'blog')} className="text-sm font-semibold text-ink hover:text-accent">
              ← {dict.common.back}
            </a>
          </p>
        </div>
      </div>
    </article>
  )
}
