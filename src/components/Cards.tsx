import Link from 'next/link'
import { href, type Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n'
import type { Post, Service, Team } from '@/payload-types'
import { Icon } from './Icon'
import { MediaImage, hasMedia } from './Media'

export function ServiceCard({
  service,
  locale,
  dict,
  dark = false,
}: {
  service: Service
  locale: Locale
  dict: Dictionary
  dark?: boolean
}) {
  return (
    <Link
      href={href(locale, 'servicios', service.slug ?? '')}
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border p-7 transition duration-300 hover:-translate-y-1 ${
        dark
          ? 'border-white/10 bg-white/[0.04] hover:border-sky/60 hover:bg-white/[0.07]'
          : 'border-line bg-white hover:border-electric/50 hover:shadow-[0_24px_50px_-30px_rgba(10,26,110,0.45)]'
      }`}
    >
      <span
        className={`mb-6 grid size-14 place-items-center rounded-xl ${dark ? 'bg-electric/20 text-sky' : 'bg-mist text-electric'}`}
      >
        <Icon name={service.icon ?? 'shield'} className="size-7" />
      </span>
      <h3 className={`text-lg font-black uppercase leading-tight ${dark ? 'text-white' : 'text-ink'}`}>
        {service.title}
      </h3>
      {service.summary && (
        <p className={`mt-3 text-sm leading-relaxed ${dark ? 'text-haze' : 'text-slate'}`}>{service.summary}</p>
      )}
      <span
        className={`mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold ${dark ? 'text-white' : 'text-navy'}`}
      >
        {dict.common.learnMore}
        <span className="grid size-6 place-items-center rounded-full bg-electric text-white transition group-hover:translate-x-1">
          <Icon name="chevron" className="size-3.5" strokeWidth={2.4} />
        </span>
      </span>
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

/** Tarjeta de perfil al estilo "MEET OUR TEAM": foto sobre fondo azul noche, nombre en mayúsculas. */
export function TeamCard({ person, dict }: { person: Team; dict: Dictionary }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl bg-night text-white">
      <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-navy-2 via-navy to-ink">
        {hasMedia(person.photo) ? (
          <MediaImage
            media={person.photo}
            size="portrait"
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <span className="font-display text-7xl tracking-wide text-white/15">{initials(person.name)}</span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink via-ink/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="text-xl leading-tight font-black uppercase">{person.name}</p>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-sky">{person.role}</p>
          {person.languages && person.languages.length > 0 && (
            <p className="mt-3 flex flex-wrap gap-1.5">
              {person.languages.map((l) => (
                <span
                  key={l}
                  title={dict.languageNames[l as keyof Dictionary['languageNames']]}
                  className="rounded-full border border-white/25 px-2 py-0.5 text-[0.65rem] font-bold uppercase"
                >
                  {l}
                </span>
              ))}
            </p>
          )}
        </div>
      </div>
      {(person.bio || person.linkedin) && (
        <div className="space-y-3 p-5 text-sm leading-relaxed text-haze">
          {person.bio && <p>{person.bio}</p>}
          {person.linkedin && (
            <a
              href={person.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-semibold text-white hover:text-sky"
            >
              <Icon name="linkedin" className="size-4" /> {dict.common.linkedin}
            </a>
          )}
        </div>
      )}
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
    <Link
      href={href(locale, 'blog', post.slug ?? '')}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgba(10,26,110,0.45)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-navy via-navy-2 to-electric">
        {hasMedia(post.cover) ? (
          <MediaImage
            media={post.cover}
            size="card"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="transition duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="dots absolute inset-0 text-white/15" />
        )}
        {category && <span className="badge absolute top-4 left-4">{category}</span>}
      </div>
      <div className="flex flex-1 flex-col p-6">
        {date && <p className="text-xs font-semibold uppercase tracking-widest text-slate">{date}</p>}
        <h3 className="mt-2 text-lg leading-snug font-extrabold text-ink group-hover:text-electric">{post.title}</h3>
        {post.excerpt && <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate">{post.excerpt}</p>}
        <span className="mt-auto pt-5 text-sm font-semibold text-navy">{dict.common.readMore} →</span>
      </div>
    </Link>
  )
}
