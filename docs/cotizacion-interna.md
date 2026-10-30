# Cotización — notas internas

Actualizado: 30 oct 2026. No compartir con el cliente.

Los precios de la propuesta salen de una estimación de horas a una tarifa promedio de **~US$30/h**. Si la tarifa es
otra, ajustar las tres propuestas en la misma proporción.

## Propuesta 1 — Creación del sitio (US$4,400)

| Componente | Horas | Precio (US$) |
| --- | ---: | ---: |
| Estrategia y dirección visual | 15 | 450 |
| Diseño UX/UI (6 secciones + 3 plantillas, móvil y escritorio, 2 rondas) | 32 | 950 |
| Desarrollo y panel de contenido (Next.js + Payload) | 42 | 1,250 |
| Cuatro idiomas (i18n, SEO por idioma, traducción del lanzamiento) | 15 | 450 |
| Conexión con la agenda de Tilín (UI de reserva en 4 idiomas + vistas en el panel) | 23 | 700 |
| WhatsApp, formularios, GA4, Search Console, SEO técnico | 8 | 250 |
| Carga de contenido, QA, lanzamiento, capacitación | 12 | 350 |
| **Total** | **147** | **4,400** |

La línea de Tilín (23 h) es la más incierta: se ajusta cuando llegue la documentación de la API. Si Tilín entrega un
widget embebible y el panel queda en Tilín, baja a ~8 h; si hay que construir la reserva completa y vistas de citas en
el panel con varios profesionales, puede subir a ~35 h.

## Propuesta 3 — Autogestión (US$1,200; US$900 en paquete)

~40 h: bloques de página con vista previa, páginas nuevas, traducción con un clic (API de Claude), roles, versiones,
2 capacitaciones grabadas + guía en video. Paquete 1 + 3 = US$5,300 (ahorro US$300).

## Propuesta 2 — Mantenimiento

| Plan | Precio | Costo estimado | Detalle |
| --- | ---: | ---: | --- |
| Esencial | US$120/mes | ~US$65–75 | Hosting ~US$25–45 + ~1 h de cambios + ~0.5 h de monitoreo/actualizaciones |
| Crecimiento | US$260/mes | ~US$235–255 | Hosting + 4 h de cambios + 2 artículos en 4 idiomas (~2 h) + informe (~1 h) |

El plan Crecimiento queda con margen bajo; si se quiere más holgura, subirlo a US$290–300 o bajar a 3 h de cambios.

## Costos de terceros (aprox., verificar precios vigentes)

| Servicio | Costo aprox. | Quién paga |
| --- | --- | --- |
| Vercel Pro | ~US$20/mes | Incluido en mantenimiento |
| Postgres (Neon / Supabase) | US$0–25/mes | Incluido en mantenimiento |
| Almacenamiento de imágenes | US$0–5/mes | Incluido en mantenimiento |
| Resend (correos) | Plan gratis al inicio | Incluido |
| API de Claude (traducciones) | Centavos por artículo | Incluido |
| Dominio msaconsultores.com | Renovación anual | MSA |
| Comisión Tilín por cobro | X% + US$0.50 + ITBMS | MSA (se descuenta del cobro) |

## Supuestos de la cotización

- MSA entrega textos en español (Excel) y fotos utilizables; sesión de fotos y copywriting se cotizan aparte.
- Traducción inicial asistida + revisión nuestra; validación nativa recomendada (sobre todo PT e IT).
- Precios sin ITBMS (7%); confirmar si quien factura está registrado para cobrarlo.
- Vigencia de la propuesta: 15 días (hasta 14 nov 2026).
- Forma de pago: 50% / 25% al aprobar diseño / 25% al lanzar.
