# Plan del proyecto — Sitio web MSA Consultores

Actualizado: 30 oct 2026.

## 1. Brief (notas de la reunión, revisadas)

| Tema | Lo que se pidió | Cómo lo interpretamos |
| --- | --- | --- |
| Imagen | Corporativa, de vanguardia; referencia: msaconsultores.com "de escuela" | Rediseño completo. La firma tiene +25 años pero el equipo es joven: el sitio debe mostrar experiencia **y** frescura, no al "contador clásico" |
| Referencias | MSA comparte referencias visuales y su trabajo en redes | Moodboard + 2 direcciones visuales a partir de sus redes |
| Contenido | Secciones e información en un Excel; fotos del equipo (lo coordina Mercadeo) | Carga inicial desde el Excel. Falta confirmar si hay fotos profesionales |
| Idiomas | Español + inglés, portugués e italiano | i18n desde el día 1 (rutas `/en`, `/pt`, `/it`); el Excel solo trae español |
| Citas | Meeting, agendar cita, acceso a agenda, **pago anticipado** | Motor de citas y cobros = **Tilín**, conectado al sitio por API (client id / secret). Detalle técnico pendiente |
| WhatsApp | Integrado para que les escriban | Botón flotante + mensajes precargados por página/servicio/idioma |
| Mobile | Que corra sin problema en el celular | Diseño mobile-first; meta Lighthouse ≥ 90 en móvil |
| Secciones | 5–6 | Ver mapa del sitio |
| Blog | Actividades del equipo, quiénes somos, cómo trabajamos | Blog con categorías: Artículos, Noticias, Actividades del equipo |
| Propuestas | Separadas: creación / mantenimiento / builder ("ustedes pueden editar") | Propuesta 1 creación, 2 mantenimiento, 3 autogestión (editor por bloques) |
| Fecha | Montada en diciembre | Lanzamiento 15 dic 2026, con colchón antes de las fiestas |

## 2. Mapa del sitio (6 secciones)

1. **Inicio** — propuesta de valor, cifras, servicios destacados, testimonios, últimas publicaciones. CTA: agendar.
2. **Nosotros** — historia (25+ años), misión, valores, cómo trabajamos.
3. **Servicios** — listado + página por servicio con FAQ. CTA: agendar ese servicio.
4. **Equipo** — perfiles: foto, cargo, especialidad, idiomas, LinkedIn. CTA: agendar con esa persona (*depende de Tilín, ver preguntas*).
5. **Blog y actividades** — artículos, noticias y actividades con galería.
6. **Contacto y citas** — agenda, formulario, WhatsApp, mapa, horario.

Más: política de privacidad y aviso de cookies (Ley 81 de 2019 de protección de datos personales).

## 3. Stack propuesto

Quién hace qué: la dirección del proyecto y la relación con MSA, Richard; diseño, desarrollo, contenido y despliegue, Claude Code.

| Capa | Elección | Por qué |
| --- | --- | --- |
| Front | Next.js (App Router) + TypeScript + Tailwind | Mismo stack que Tilín; SSR/SSG para SEO y velocidad |
| CMS / panel | Payload CMS (dentro del mismo Next.js) | Open source, sin licencias por usuario; localización por campo nativa (4 idiomas); bloques para el "builder" (Propuesta 3); vista previa en vivo, borradores, versiones, roles |
| Base de datos | Postgres en Railway | Adapter oficial de Payload; mismo proyecto de Railway |
| Archivos | Almacenamiento S3 compatible (p. ej. Cloudflare R2) | Fotos del equipo y del blog |
| Hosting | Railway | Un servicio para sitio + panel y otro para Postgres; entorno de prueba aparte para que MSA revise |
| Correos | Resend | Formulario de contacto |
| Analítica | GA4 + Search Console (+ Meta Pixel si lo piden) | |
| Traducción asistida | Botón en el panel que genera borradores EN/PT/IT con la API de Claude | Hace sostenible un blog en 4 idiomas para un equipo pequeño (Propuesta 3) |

Con solo la Propuesta 1, el panel trae: Blog/Actividades, Equipo y (cuando esté la API) Citas. Con la Propuesta 3 se suman
las páginas armadas por bloques, páginas nuevas, traducción con un clic y roles.

## 4. Integración con Tilín (pendiente — se define más adelante)

Decisión: **el motor de citas y cobros es Tilín**; no se construye un sistema de agenda dentro del sitio. La conexión va **incluida sin costo** en la cotización. El sitio se
conecta por API con credenciales de cliente (client id / client secret). El detalle lo envía el equipo de Tilín.

Lo que hoy tiene la Agenda de Tilín (FEATURES.md §17 del repo de Tilín) y aplica a MSA:
servicios con duración/precio/anticipo, horario por turnos, apartado mientras paga, cobro con PagueloFácil + 3DS,
confirmación con `.ics`, recordatorios 24 h y 2 h, reprogramar/cancelar con reembolso, videollamada por servicio,
Google Calendar del comercio.

Puntos a validar del lado de Tilín antes de cerrar el alcance de la conexión:

- [ ] **Varios profesionales**: MSA querrá "agendar con X". En Tilín está en "Lo que sigue" (`staff_id` existe en `appointments`, falta el resto).
- [ ] **Idiomas**: checkout, correos, recordatorios y `/cita/[token]` están solo en español. Para clientes EN/PT/IT hace falta un parámetro de idioma o que el sitio envíe sus propios correos.
- [ ] **Regreso al sitio**: después del 3DS hoy vuelve a la tienda de Tilín; se necesita un `return_url` hacia msaconsultores.com.
- [ ] **Panel**: qué se muestra en el panel del sitio (citas, pagos) y qué queda en el panel de Tilín (wallet, retiros).
- [ ] **KYB de MSA** en Tilín: requisito para cobrar anticipos.
- [ ] **Comisión** que pagará MSA por cobro (X% + US$0.50 + ITBMS).

## 5. Cronograma

| Semana | Fechas | Trabajo | Hito / dependencia de MSA |
| --- | --- | --- | --- |
| 0 | 2–6 nov | Arranque, insumos (semana corta: fiestas patrias) | Aprobación + anticipo (6 nov); Excel, fotos, marca (9 nov) |
| 1 | 9–13 nov | Moodboard + 2 direcciones visuales | Elección de dirección (16 nov) |
| 2 | 16–20 nov | Diseño de páginas (móvil + escritorio); setup técnico en paralelo | Servicios a agendar, KYB Tilín, WhatsApp (20 nov) |
| 3 | 23–27 nov | Desarrollo de secciones + panel + i18n; conexión Tilín | Aprobación del diseño (23 nov); acceso al dominio (27 nov) |
| 4 | 30 nov–4 dic | Desarrollo, conexión Tilín, WhatsApp, carga de contenido y traducciones | Revisión de textos y traducciones (4 dic) |
| 5 | 7–11 dic | Sitio de prueba, QA en dispositivos, ajustes (8 dic feriado) | Revisión del sitio de prueba (11 dic) |
| 6 | 14–18 dic | Capacitación y **lanzamiento 15 dic**; monitoreo | — |
| — | 15 dic–14 ene | Garantía 30 días | Mantenimiento arranca ~15 ene 2027 |

**Riesgo principal:** la conexión con Tilín depende de que su API (y los puntos de la sección 4) esté lista a fines de
noviembre. Plan B para no mover el 15 dic: lanzar con los botones de "Agendar" enlazando a la página de reservas de
MSA en Tilín (que ya soporta dominio propio, p. ej. `agenda.msaconsultores.com`) y activar la reserva dentro del sitio
en enero.
