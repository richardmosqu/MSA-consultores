/**
 * Carga inicial de contenido (idempotente: se puede correr varias veces).
 *   pnpm seed
 * Crea o actualiza: ajustes del sitio, servicios, grupos y personas del equipo,
 * testimonios y las páginas del builder (inicio, nosotros, casos de éxito, cultura MSA, privacidad).
 * Si se definen SEED_ADMIN_EMAIL y SEED_ADMIN_PASSWORD crea además un usuario administrador.
 */
import config from '@payload-config'
import { getPayload, type Payload } from 'payload'
import type { Page } from '../payload-types'
import * as c from './content'
import { doc, h, p, paragraphs, ul } from './lexical'

type CollectionSlug = 'services' | 'team' | 'team-groups' | 'testimonials' | 'pages'
const ctx = { disableRevalidate: true }

async function upsert(
  payload: Payload,
  collection: CollectionSlug,
  where: Record<string, { equals: unknown }>,
  data: Record<string, unknown>,
) {
  const { docs } = await payload.find({ collection, where, limit: 1, depth: 0, context: ctx })
  if (docs[0]) {
    return payload.update({ collection, id: docs[0].id, data, locale: 'es', depth: 0, context: ctx } as never)
  }
  return payload.create({ collection, data, locale: 'es', depth: 0, context: ctx } as never)
}

type Blocks = NonNullable<Page['layout']>
type IconValue = 'tax' | 'accounting' | 'labor' | 'finance' | 'talent' | 'audit' | 'legal' | 'compliance' | 'shield' | 'building' | 'calendar' | 'globe'

const pages: { slug: string; title: string; layout: Blocks }[] = [
  {
    slug: 'inicio',
    title: 'Inicio',
    layout: [
      {
        blockType: 'hero',
        eyebrow: 'Consultoría que te da tranquilidad',
        title: 'Más que asesoría, *aliados estratégicos*',
        subtitle:
          'Consultoría fiscal, financiera, legal, compliance y capital humano para empresas en Panamá y la región.',
        primary: { type: 'booking', label: 'Agenda una consultoría' },
        secondary: { type: 'whatsapp', label: 'WhatsApp' },
        size: 'large',
      },
      {
        blockType: 'highlights',
        items: [
          {
            label: 'Quiénes somos',
            title: 'Una firma multidisciplinaria con más de 18 años de experiencia',
            text: c.intro.firma1,
            link: { type: 'internal', route: 'nosotros' },
          },
          {
            label: 'Agenda una consultoría',
            title: 'Conecta con el área especializada según tu necesidad',
            text: 'Presidencia · Fiscal · RRHH · Legal · Finanzas',
            accent: true,
            link: { type: 'booking' },
          },
          {
            label: 'Casos de éxito',
            title: '«Los recomendaría con los ojos cerrados»',
            text: 'Rogelio Romero — Concretex, S.A.',
            link: { type: 'internal', route: 'casos-de-exito' },
          },
        ],
      },
      {
        blockType: 'servicesGrid',
        eyebrow: 'Servicios',
        title: 'Soluciones integrales para *cada etapa* de tu empresa',
        intro: c.servicesIntro,
        onlyFeatured: true,
        variant: 'cards',
        theme: 'mist',
      },
      {
        blockType: 'stats',
        items: [
          { value: '18+', label: 'Años de experiencia' },
          { value: '7', label: 'Áreas especializadas' },
          { value: '2', label: 'Sedes en Panamá' },
          { value: 'BR · EU', label: 'Consultoría internacional' },
        ],
      },
      {
        blockType: 'departments',
        eyebrow: 'Agenda una consultoría',
        title: 'Elige el área *según tu necesidad*',
        intro: 'Agenda directamente con el equipo especializado.',
        action: 'booking',
        theme: 'light',
      },
      {
        blockType: 'teamGrid',
        eyebrow: 'Nuestro equipo',
        title: 'Las personas detrás de *nuestra excelencia*',
        limit: 4,
        theme: 'light',
      },
      {
        blockType: 'testimonials',
        eyebrow: 'Casos de éxito',
        title: 'Lo que dicen *nuestros clientes*',
        theme: 'mist',
      },
      {
        blockType: 'latestPosts',
        eyebrow: 'Blog',
        title: 'Alertas y *novedades*',
        category: 'all',
        limit: 3,
        theme: 'light',
      },
      {
        blockType: 'cta',
        title: '¿Hablamos de *tu empresa*?',
        text: c.contact.intro,
        primary: { type: 'booking', label: 'Agenda una consultoría' },
        secondary: { type: 'whatsapp', label: 'WhatsApp' },
      },
    ],
  },
  {
    slug: 'nosotros',
    title: 'Nosotros',
    layout: [
      {
        blockType: 'hero',
        eyebrow: 'Nuestra historia',
        title: 'Experiencia técnica, *visión estratégica*',
        subtitle: c.about.historia,
        primary: { type: 'internal', route: 'servicios', label: 'Ver servicios' },
        secondary: { type: 'none' },
        size: 'compact',
      },
      {
        blockType: 'features',
        eyebrow: 'Propósito',
        title: 'Misión y *visión*',
        items: [
          { icon: 'compliance', title: 'Misión', text: c.about.mision },
          { icon: 'finance', title: 'Visión', text: c.about.vision },
        ],
        theme: 'light',
      },
      {
        blockType: 'features',
        eyebrow: 'Lo que nos mueve',
        title: 'Nuestros *valores*',
        items: c.about.valores.map((v, i) => ({
          icon: (['shield', 'audit', 'talent', 'finance', 'building', 'compliance', 'labor'] as const)[i],
          title: v,
        })),
        theme: 'mist',
      },
      {
        blockType: 'imageText',
        eyebrow: 'Presencia regional',
        title: 'Panamá, Azuero y *el mundo*',
        body: doc(p(c.about.presencia)),
        imagePosition: 'left',
        link: { type: 'internal', route: 'contacto', label: 'Ver sedes y contacto' },
        theme: 'light',
      },
      {
        blockType: 'content',
        eyebrow: 'Cultura organizacional',
        title: 'Aprender, crecer y *trabajar juntos*',
        body: doc(p(c.about.cultura)),
        theme: 'mist',
      },
      {
        blockType: 'content',
        eyebrow: 'Filosofía de trabajo',
        title: 'Relaciones a *largo plazo*',
        body: doc(p(c.about.filosofia)),
        theme: 'light',
      },
      {
        blockType: 'cta',
        title: 'Conoce al *equipo*',
        text: c.teamIntro,
        primary: { type: 'internal', route: 'equipo', label: 'Ver equipo' },
        secondary: { type: 'booking', label: 'Agenda una consultoría' },
      },
    ],
  },
  {
    slug: 'casos-de-exito',
    title: 'Casos de éxito',
    layout: [
      {
        blockType: 'hero',
        eyebrow: 'Casos de éxito',
        title: 'La confianza de *nuestros clientes*',
        subtitle: c.casesIntro,
        primary: { type: 'booking', label: 'Agenda una consultoría' },
        secondary: { type: 'none' },
        size: 'compact',
      },
      { blockType: 'testimonials', title: 'Testimonios', theme: 'light' },
      {
        blockType: 'cta',
        title: '¿Quieres ser el *próximo caso*?',
        text: c.contact.intro,
        primary: { type: 'booking', label: 'Agenda una consultoría' },
        secondary: { type: 'whatsapp', label: 'Escríbenos por WhatsApp' },
      },
    ],
  },
  {
    slug: 'cultura-msa',
    title: 'Cultura MSA',
    layout: [
      {
        blockType: 'hero',
        eyebrow: 'Cultura MSA',
        title: 'Un equipo que *aprende y crece*',
        subtitle: c.about.cultura,
        primary: { type: 'internal', route: 'equipo', label: 'Conoce al equipo' },
        secondary: { type: 'none' },
        size: 'compact',
      },
      {
        blockType: 'imageText',
        eyebrow: 'Kickoffs',
        title: 'Encuentros *semestrales*',
        body: paragraphs(c.culture.kickoffs),
        imagePosition: 'right',
        link: { type: 'none' },
        theme: 'light',
      },
      {
        blockType: 'features',
        eyebrow: 'Vida en MSA',
        title: 'Cómo *crecemos juntos*',
        items: c.culture.items.map((it) => ({ ...it, icon: it.icon as IconValue })),
        theme: 'mist',
      },
      {
        blockType: 'latestPosts',
        eyebrow: 'Actividades del equipo',
        title: 'Lo que hacemos *fuera de la oficina*',
        category: 'actividades',
        limit: 6,
        theme: 'light',
      },
    ],
  },
  {
    slug: 'privacidad',
    title: 'Política de privacidad',
    layout: [
      {
        blockType: 'hero',
        eyebrow: 'Ley 81 de 2019',
        title: 'Política de *privacidad*',
        subtitle: 'Cómo tratamos los datos personales que nos compartes a través de este sitio.',
        primary: { type: 'none' },
        secondary: { type: 'none' },
        size: 'compact',
      },
      {
        blockType: 'content',
        title: 'Borrador para revisión del equipo legal',
        body: doc(
          p(
            'MSA Consultores (Mateos Saint Malo & Asociados) es responsable del tratamiento de los datos personales recabados en este sitio, conforme a la Ley 81 de 2019 sobre protección de datos personales de la República de Panamá y su reglamentación.',
          ),
          h('Qué datos recabamos', 'h3'),
          ul([
            'Datos que nos envías en el formulario de contacto: nombre, correo, teléfono, empresa y mensaje.',
            'Datos de la reserva de citas, que se procesan en la plataforma Tilín.',
            'Datos de navegación mediante cookies de analítica, solo si las aceptas.',
          ]),
          h('Para qué los usamos', 'h3'),
          p('Para responder tus consultas, gestionar tus citas y mejorar el sitio. No vendemos ni cedemos tus datos a terceros con fines comerciales.'),
          h('Tus derechos', 'h3'),
          p(
            'Puedes ejercer tus derechos de acceso, rectificación, cancelación, oposición y portabilidad escribiendo a compliance@msaconsultores.com.',
          ),
        ),
        theme: 'light',
      },
    ],
  },
]

async function run() {
  const payload = await getPayload({ config })
  payload.logger.info('Seed: inicio')

  const email = process.env.SEED_ADMIN_EMAIL
  const password = process.env.SEED_ADMIN_PASSWORD
  if (email && password) {
    const { totalDocs } = await payload.count({ collection: 'users', where: { email: { equals: email } } })
    if (!totalDocs) {
      await payload.create({ collection: 'users', data: { email, password, name: 'Administrador', role: 'admin' } })
      payload.logger.info(`Seed: usuario administrador ${email}`)
    }
  }

  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'es',
    context: ctx,
    data: {
      phones: c.contact.phones.map((number) => ({ number })),
      email: c.contact.email,
      officeName: c.contact.officeName,
      address: c.contact.address,
      offices: c.contact.offices.map((o) => ({ ...o, status: o.status as 'active' | 'soon' | 'international' })),
      departments: c.contact.departments.map((d) => ({ ...d, icon: d.icon as IconValue })),
      whatsappNumber: c.contact.whatsapp,
      bookingMode: 'contact',
      instagram: c.contact.instagram,
    },
  })

  for (const [i, s] of c.services.entries()) {
    await upsert(payload, 'services', { slug: { equals: s.slug } }, {
      ...s,
      // El detalle (listado de servicios por área) lo envía MSA; mientras tanto la página
      // muestra el resumen, la navegación entre áreas y el bloque para agendar.
      body: null,
      order: (i + 1) * 10,
      featured: true,
    })
  }

  const groupIds: Record<string, number> = {}
  for (const [i, g] of c.teamGroups.entries()) {
    const saved = (await upsert(payload, 'team-groups', { name: { equals: g.name } }, {
      name: g.name,
      description: g.description,
      order: (i + 1) * 10,
    })) as { id: number }
    groupIds[g.key] = saved.id
  }

  for (const person of c.people) {
    await upsert(payload, 'team', { name: { equals: person.name } }, {
      name: person.name,
      role: person.role,
      group: groupIds[person.group],
      order: person.order,
      languages: ['es'],
    })
  }

  for (const t of c.testimonials) {
    await upsert(payload, 'testimonials', { author: { equals: t.author } }, t)
  }

  for (const page of pages) {
    await upsert(payload, 'pages', { slug: { equals: page.slug } }, { ...page, _status: 'published' })
  }

  payload.logger.info('Seed: listo')
  process.exit(0)
}

// Top-level await: `payload run` termina el proceso apenas se resuelve el import.
try {
  await run()
} catch (err) {
  console.error(err)
  process.exit(1)
}
