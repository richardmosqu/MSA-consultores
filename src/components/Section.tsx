import { Highlight } from './Highlight'

export type Theme = 'light' | 'dark' | 'mist'

/**
 * Sección. "light" = fondo blanco; "mist" = panel gris redondeado; "dark" = panel azul noche redondeado.
 * Los paneles dejan un margen al borde de la pantalla, como el hero.
 */
export function Section({
  theme = 'light',
  className = '',
  id,
  children,
}: {
  theme?: Theme | null
  className?: string
  id?: string
  children: React.ReactNode
}) {
  if (theme === 'mist' || theme === 'dark') {
    return (
      <section id={id} className={`py-3 ${className}`}>
        <div
          className={`frame py-16 sm:py-24 ${theme === 'dark' ? 'on-dark bg-ink text-white' : 'bg-surface'}`}
        >
          {children}
        </div>
      </section>
    )
  }
  return (
    <section id={id} className={`py-16 sm:py-24 ${className}`}>
      {children}
    </section>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  dark = false,
  align = 'center',
  className = '',
}: {
  eyebrow?: string | null
  title?: string | null
  intro?: string | null
  dark?: boolean
  align?: 'left' | 'center'
  className?: string
}) {
  if (!eyebrow && !title && !intro) return null
  const center = align === 'center'
  return (
    <div className={`mb-10 max-w-3xl sm:mb-14 ${center ? 'mx-auto text-center' : ''} ${className}`}>
      {eyebrow && <p className={`mb-5 ${dark ? 'pill-label-dark' : 'pill-label'}`}>{eyebrow}</p>}
      {title && (
        <h2 className={`display-lg ${dark ? 'text-white' : 'text-ink'}`}>
          <Highlight text={title} dark={dark} />
        </h2>
      )}
      {intro && (
        <p className={`mt-5 text-base leading-relaxed sm:text-lg ${dark ? 'text-white/70' : 'text-muted'}`}>{intro}</p>
      )}
    </div>
  )
}
