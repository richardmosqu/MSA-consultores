import type { Metadata } from 'next'
import { TeamCard } from '@/components/Cards'
import { PageHeader } from '@/components/PageHeader'
import { getPayloadClient, getTeam } from '@/lib/payload'
import { pageMetadata } from '@/lib/seo'
import { getSite } from '@/lib/site'
import type { Team, TeamGroup } from '@/payload-types'

export async function generateMetadata({ params }: PageProps<'/[locale]/equipo'>): Promise<Metadata> {
  const site = await getSite((await params).locale)
  return pageMetadata({ locale: site.locale, route: 'equipo', title: site.dict.nav.team, description: site.dict.team.intro })
}

export default async function TeamPage({ params }: PageProps<'/[locale]/equipo'>) {
  const site = await getSite((await params).locale)
  const { dict } = site
  const payload = await getPayloadClient()
  const [team, groupsRes] = await Promise.all([
    getTeam(site.locale),
    payload.find({ collection: 'team-groups', locale: site.locale, sort: 'order', limit: 50 }),
  ])

  // Agrupa a las personas según el grupo asignado (Presidencia / VP, Gerencias, Consultores…).
  const byGroup = new Map<number | 'none', Team[]>()
  for (const person of team) {
    const key = person.group && typeof person.group === 'object' ? person.group.id : 'none'
    byGroup.set(key, [...(byGroup.get(key) ?? []), person])
  }
  const groups: { group: TeamGroup | null; people: Team[] }[] = [
    ...groupsRes.docs.map((g) => ({ group: g, people: byGroup.get(g.id) ?? [] })),
    { group: null, people: byGroup.get('none') ?? [] },
  ].filter((g) => g.people.length > 0 || (g.group && g.group.description))

  return (
    <>
      <PageHeader
        breadcrumbs={[{ href: `/${site.locale}`, label: dict.common.home }, { label: dict.nav.team }]}
        eyebrow={dict.team.badge}
        title={dict.team.title}
        intro={dict.team.intro}
      />
      <section className="py-16 sm:py-24">
        <div className="container-site space-y-20">
          {groups.length === 0 && <p className="text-muted">{dict.team.empty}</p>}
          {groups.map(({ group, people }) => (
            <div key={group?.id ?? 'none'}>
              {group && (
                <div className="mb-8 grid gap-4 lg:grid-cols-12">
                  <h2 className="display-md text-ink lg:col-span-4">{group.name}</h2>
                  {group.description && <p className="leading-relaxed text-muted lg:col-span-8">{group.description}</p>}
                </div>
              )}
              {people.length > 0 && (
                <div className="grid gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
                  {people.map((p) => (
                    <TeamCard key={p.id} person={p} dict={dict} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
