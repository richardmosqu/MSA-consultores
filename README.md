# MSA Consultores — Sitio web corporativo

Sitio de MSA — Mateos Saint Malo & Asociados (consultoría fiscal, financiera, legal, compliance y capital humano en Panamá),
con panel de contenido, cuatro idiomas (ES · EN · PT · IT), WhatsApp y agenda de citas con Tilín.
Lanzamiento objetivo: **15 de diciembre de 2026**.

## Documentos

| Documento | Para qué |
| --- | --- |
| [docs/plan-del-proyecto.md](docs/plan-del-proyecto.md) | Brief, alcance, mapa del sitio, stack y cronograma (actualizado al arranque) |
| [docs/preguntas-abiertas.md](docs/preguntas-abiertas.md) | Dudas e insumos pendientes de MSA y de Tilín |
| [docs/insumos/](docs/insumos/) | Archivos que envía MSA (Excel de secciones y textos) |

La cotización y las notas de precios viven fuera de este repo: el código se entrega a MSA al final.

## Stack

- **Next.js 16** (App Router, TypeScript, Tailwind CSS 4) — front con páginas en caché (ISR) que se actualizan al publicar.
- **Payload CMS 3** dentro del mismo Next.js — panel en `/admin`, localización por campo, borradores y versiones.
- **Postgres** (Railway) · imágenes en **Cloudflare R2** (S3) · avisos del formulario con **Resend**.

## Cómo está armado

```
src/
  app/(frontend)/[locale]/   Páginas públicas: inicio, servicios, equipo, blog, contacto y [slug] (builder)
  app/(payload)/             Panel y API de Payload (generado)
  collections/               Páginas, Servicios, Equipo, Grupos del equipo, Blog, Testimonios, Imágenes, Mensajes, Usuarios
  globals/SiteSettings.ts    Contacto, sedes, departamentos, WhatsApp, agenda (Tilín), redes, analítica
  blocks/                    Bloques del builder (portada, cifras, servicios, departamentos, texto, imagen+texto…)
  components/                UI: header con menú de servicios, footer, tarjetas, bloques, WhatsApp, cookies
  i18n/                      Idiomas, rutas traducidas (/en/services, /pt/servicos…) y textos de la interfaz
  lib/                       Consultas a Payload, enlaces de agenda/WhatsApp, SEO
  proxy.ts                   Redirección por idioma y reescritura de rutas traducidas
  seed/                      Contenido inicial tomado del Excel de MSA
  migrations/                Migraciones de base de datos (corren solas en producción)
```

**Páginas del builder.** Inicio, Nosotros, Casos de éxito, Cultura MSA y Privacidad son páginas de Payload armadas con
bloques (slugs `inicio`, `nosotros`, `casos-de-exito`, `cultura-msa`, `privacidad`). MSA puede reordenarlas, editarlas y crear
páginas nuevas (`/es/<slug>`). Servicios, Equipo, Blog y Contacto usan plantillas fijas alimentadas por sus colecciones.

**Navegación de servicios.** Las 7 áreas están siempre a un clic: menú desplegable en el header (escritorio) y acordeón en el
menú móvil; en cada servicio, migas de pan, lista lateral de áreas (escritorio) o barra deslizable (móvil), y "área
anterior / siguiente" al final; además, columna de servicios en el footer.

**Agenda.** Todo botón "Agendar" pasa por `bookingLink()` en `src/lib/links.ts`. Hoy: enlace a la página de reservas de MSA
en Tilín (o al formulario de contacto mientras no exista). Cada servicio y cada departamento admite su propio enlace de
Tilín. Cuando Tilín entregue la API, ese es el punto que cambia.

## Desarrollo local

Requisitos: Node 22+, pnpm 10, Postgres 16 (`docker compose up -d` levanta uno).

```bash
cp .env.example .env
```

```bash
pnpm install
```

```bash
SEED_ADMIN_EMAIL=tu@correo.com SEED_ADMIN_PASSWORD=una-clave pnpm seed
```

```bash
pnpm dev
```

Sitio en http://localhost:3000 (redirige a `/es`), panel en http://localhost:3000/admin.

Otros comandos: `pnpm lint`, `pnpm typecheck`, `pnpm build`, `pnpm generate:types` (tras cambiar colecciones).

**Cambios en la base de datos.** En desarrollo Payload sincroniza el esquema solo. Antes de desplegar un cambio de
colecciones o bloques, crea la migración y súbela con el código:

```bash
pnpm payload migrate:create nombre-del-cambio
```

## Despliegue (Railway)

Un proyecto con dos servicios: **Postgres** y **web** (este repo, con `Dockerfile` y `railway.json`). Variables del servicio web:

| Variable | Valor |
| --- | --- |
| `DATABASE_URL` | Referencia a `${{Postgres.DATABASE_URL}}` |
| `PAYLOAD_SECRET` | Cadena aleatoria larga, distinta por entorno |
| `NEXT_PUBLIC_SERVER_URL` | `https://msaconsultores.com` (o la URL del entorno de prueba) |
| `S3_BUCKET`, `S3_ENDPOINT`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` | Bucket de Cloudflare R2 para imágenes |
| `RESEND_API_KEY`, `CONTACT_FROM_EMAIL` | Aviso por correo de los mensajes del formulario |

El build no necesita la base de datos; al arrancar, el servidor aplica las migraciones pendientes. El primer usuario se crea
desde `/admin` y queda como administrador. Después de desplegar en una base vacía, cargar el contenido inicial con
`NODE_ENV=production pnpm seed` apuntando a esa base.

## Estado

- [x] Plan, cotización y aprobación
- [x] Insumos recibidos: identidad visual (Instagram) y Excel de secciones y textos
- [x] Base técnica: Next.js + Payload, 4 idiomas, panel, builder, SEO, cookies (Ley 81), formulario, WhatsApp
- [x] Diseño aplicado a partir de la identidad de MSA (azul noche + azul eléctrico, titulares en mayúsculas)
- [x] Contenido inicial del Excel cargado (español)
- [ ] Entorno de prueba en Railway para que MSA revise
- [ ] Insumos pendientes de MSA (ver [preguntas abiertas](docs/preguntas-abiertas.md))
- [ ] Traducciones EN / PT / IT
- [ ] Integración con Tilín por API (hoy: enlace a la página de reservas)
