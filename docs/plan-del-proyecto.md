# Plan del proyecto — Sitio web MSA Consultores

Actualizado: 24 nov 2026 (arranque del desarrollo). Versión anterior: 30 oct 2026.

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

## 2. Mapa del sitio (según el Excel de MSA, 24 nov)

El Excel "MSA WEBSITE — secciones y textos" ([docs/insumos](insumos/)) reemplaza el mapa de 6 secciones de la cotización.
El alcance es el mismo; cambia la organización:

1. **Inicio** — propuesta de valor, cifras, *agenda una consultoría según tu necesidad* (botones por departamento: Presidencia, Fiscal, RRHH, Legal, Finanzas), intro de la firma, áreas de trabajo, equipo, testimonios, últimas publicaciones. CTA: agendar / WhatsApp.
2. **Nosotros** — historia, misión y visión, valores, presencia regional, cultura organizacional, filosofía de trabajo.
3. **Equipo** — intro + grupos (Presidencia/VP, Gerencias, Consultores, RRHH, Legal, Compliance, Activos Productivos, Operaciones), cada uno con su descripción y perfiles con foto.
4. **Servicios** — intro + 7 áreas (Fiscal y Tributario, Auditoría, Recursos Humanos, Legal Corporativo, Compliance, Activos Productivos, Finanzas y Consultoría Estratégica), cada una con su página y listado de servicios.
5. **Casos de éxito** — intro, testimonios y casos.
6. **Cultura MSA** — kickoffs, capacitaciones, eventos, actividades internas, crecimiento del equipo, experiencias corporativas + actividades publicadas.
7. **Contacto** — agenda una consultoría / habla con un consultor / WhatsApp / contacta un departamento; oficina principal y presencia regional (Azuero, próximamente David, consultoría internacional).

Más: **Blog** (alertas fiscales, artículos y actividades; el mismo motor alimenta Cultura MSA), política de privacidad y aviso
de cookies (Ley 81 de 2019).

**Navegación de servicios** (pedido de Richard, 24 nov): que se puedan explorar los servicios sin perderse. Menú desplegable
con las 7 áreas en el header (acordeón en móvil), migas de pan, lista lateral de áreas en cada servicio (barra deslizable en
móvil), "área anterior / siguiente", columna de servicios en el footer y botón de agendar siempre visible.

## 2b. Dirección visual: tres propuestas (25 nov)

MSA recibe tres direcciones para elegir ([docs/propuestas](propuestas/), con PDF de presentación):

- **A · Impacto** — fiel a su Instagram: azul noche y eléctrico, mayúsculas gruesas, diagonales y stickers.
- **B · Cercana** — siguiendo la referencia que compartió Richard: fondos claros, paneles y tarjetas redondeadas,
  etiquetas tipo píldora, botones con flecha, titulares de peso regular; el azul de MSA como único acento.
- **C · Editorial** — serif en titulares (eco del logotipo) con cursivas, esquinas rectas, líneas finas, fondo papel,
  portada clara tipo revista y secciones numeradas.

Las tres usan el mismo contenido, navegación, panel y funciones. Todas dependen de **fotos reales** (portada, ambiente y
retratos); sin ellas se ven ordenadas pero con espacios reservados.

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

### Ajuste al arranque real (24 nov)

La aprobación y la firma llegaron el 24 nov, no el 6 nov. Para mantener el **lanzamiento del 15 dic** comprimimos así:
la dirección visual sale de su identidad en redes (sin ronda de dos propuestas), y diseño y desarrollo van en paralelo
sobre el sitio real en lugar de maquetas.

| Semana | Fechas | Trabajo | Hito / dependencia de MSA |
| --- | --- | --- | --- |
| 1 | 24–28 nov | ✅ Base técnica, panel, 4 idiomas, contenido del Excel cargado. ✅ Rediseño sobrio (25 nov). Entorno de prueba en Railway | **Revisión del sitio de prueba v1** y respuesta a las [preguntas abiertas](preguntas-abiertas.md) (28 nov) |
| 2 | 1–5 dic | Ajustes de diseño, contenido definitivo (servicios por área, perfiles, casos), traducciones EN/PT/IT, conexión con Tilín (o plan B), WhatsApp final | Fotos, logo en vector, listado de servicios, perfiles (2 dic); revisión de textos y traducciones (5 dic) |
| 3 | 8–12 dic | QA en dispositivos, velocidad (Lighthouse ≥ 90), SEO, capacitación del panel, dominio (8 dic feriado) | Aprobación del sitio de prueba (11 dic); acceso al dominio (11 dic) |
| 4 | 14–18 dic | **Lanzamiento 15 dic**; monitoreo | — |
| — | 15 dic–14 ene | Garantía 30 días | Mantenimiento arranca ~15 ene 2027 |

**Riesgos:**

- **Insumos de MSA.** Con tres semanas, cada día de atraso en fotos, perfiles y listado de servicios se come el margen de QA. Si al 5 dic falta algo, se lanza con lo que haya (el panel permite completarlo después).
- **Tilín.** La conexión depende de que su API (y los puntos de la sección 4) esté lista. Plan B sin mover el 15 dic: los botones de "Agendar" enlazan a la página de reservas de MSA en Tilín (por departamento si Tilín lo permite) y la reserva dentro del sitio se activa en enero. El sitio ya funciona así: es un cambio de ajuste en el panel.
- **Traducciones PT/IT.** Necesitan quien las valide del lado de MSA antes del 5 dic.
