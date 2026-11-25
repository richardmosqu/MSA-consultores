import Link from 'next/link'
import { href, type Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n'
import type { Post, Service, Team } from '@/payload-types'
import { CornerArrow } from './ButtonLink'
import { Icon } from './Icon'
import { MediaImage, hasMedia } from './Media'

/** Servicio: con foto → foto con insignia de ícono; sin foto → tarjeta limpia con ícono. */
export function ServiceCard({ service, locale, dict }: { service: Service; locale: Locale; dict: Dictionary }) {
  const link = href(locale, 'servicios', service.slug ?? '')
  if (hasMedia(service.image)) {
    return (
      <Link href={link} className="group relative flex aspect-[4/5] flex-col overflow-hidden rounded-card bg-ink">
        <MediaImage
          media={service.image}
          size="portrait"
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="transition duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
        <span className="icon-badge relative m-5">
          <Icon name={service.icon ?? 'shield'} className="size-5" />
        </span>
        <div className="relative mt-auto flex items-end justify-between gap-4 p-5 text-white">
          <h3 className="font-display text-xl leading-tight">{service.title}</h3>
          <CornerArrow dark />
        </div>
      </Link>
    )
  }
  return (
    <Link
      href={link}
      className="group flex h-full flex-col rounded-card bg-white p-6 ring-1 ring-line transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_50px_-30px_rgba(12,26,71,0.35)] sm:p-7"
    >
      <div className="flex items-start justify-between">
        <span className="icon-badge">
          <Icon name={service.icon ?? 'shield'} className="size-5" />
        </span>
        <CornerArrow />
      </div>
      <h3 className="mt-8 font-display text-xl leading-tight text-ink">{service.title}</h3>
      {service.summary && <p className="mt-3 text-sm leading-relaxed text-muted">{service.summary}</p>}
      <span className="sr-only">{dict.common.learnMore}</span>
    </Link>
  )
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()

export function TeamCard({ person, dict }: { person: Team; dict: Dictionary }) {
  return (
    <article className="group">
      <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-surface">
        {hasMedia(person.photo) ? (
          <MediaImage
            media={person.photo}
            size="portrait"
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <span className="grid size-24 place-items-center rounded-dot bg-white font-display text-3xl text-accent">
              {initials(person.name)}
            </span>
          </div>
        )}
        {person.linkedin && (
          <a
            href={person.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${dict.common.linkedin} · ${person.name}`}
            className="absolute top-4 right-4 grid size-10 place-items-center rounded-dot bg-white text-ink shadow-sm hover:text-accent"
          >
            <Icon name="linkedin" className="size-4" />
          </a>
        )}
      </div>
      <div className="px-1 pt-4">
        <h3 className="font-display text-lg leading-tight text-ink">{person.name}</h3>
        <p className="mt-1 text-sm text-muted">{person.role}</p>
        {person.bio && <p className="mt-3 text-sm leading-relaxed text-muted">{person.bio}</p>}
        {person.languages && person.languages.length > 1 && (
          <p className="mt-3 flex flex-wrap gap-1.5" aria-label={dict.common.languages}>
            {person.languages.map((l) => (
              <span
                key={l}
                title={dict.languageNames[l as keyof Dictionary['languageNames']]}
                className="rounded-dot bg-surface px-2.5 py-0.5 text-[0.65rem] font-semibold text-muted uppercase"
              >
                {l}
              </span>
            ))}
          </p>
        )}
      </div>
    </article>
  )
}

export function PostCard({ post, locale, dict }: { post: Post; locale: Locale; dict: Dictionary }) {
  const date = post.publishedAt
    ? new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(
        new Date(post.publishedAt),
      )
    : null
  const category = dict.blog.categories[post.category as keyof Dictionary['blog']['categories']]
  return (
    <Link href={href(locale, 'blog', post.slug ?? '')} className="group flex h-full flex-col rounded-card bg-surface p-3">
      <div className="relative aspect-[16/11] overflow-hidden rounded-card-sm bg-accent-soft">
        {hasMedia(post.cover) && (
          <MediaImage
            media={post.cover}
            size="card"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="transition duration-500 group-hover:scale-[1.03]"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-3">
          {category && <span className="pill-label">{category}</span>}
          {date && <span className="text-xs text-muted">{date}</span>}
        </div>
        <h3 className="mt-4 font-display text-lg leading-snug text-ink">{post.title}</h3>
        {post.excerpt && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{post.excerpt}</p>}
        <div className="mt-auto flex justify-end pt-4">
          <CornerArrow />
        </div>
      </div>
    </Link>
  )
}
