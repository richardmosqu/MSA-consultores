import { Highlight } from './Highlight'

export type Theme = 'light' | 'dark' | 'mist'

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
  const bg =
    theme === 'dark'
      ? 'surface-dark on-dark relative overflow-hidden'
      : theme === 'mist'
        ? 'bg-mist'
        : 'bg-white'
  return (
    <section id={id} className={`${bg} py-16 sm:py-24 ${className}`}>
      {children}
    </section>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  dark = false,
  align = 'left',
}: {
  eyebrow?: string | null
  title?: string | null
  intro?: string | null
  dark?: boolean
  align?: 'left' | 'center'
}) {
  if (!eyebrow && !title && !intro) return null
  const center = align === 'center'
  return (
    <div className={`mb-10 max-w-3xl sm:mb-14 ${center ? 'mx-auto text-center' : ''}`}>
      {eyebrow && (
        <p className={`eyebrow mb-4 ${dark ? 'text-sky' : 'text-electric'} ${center ? '' : 'eyebrow-start'}`}>
          {eyebrow}
        </p>
      )}
      {title && (
        <h2 className={`headline-lg ${dark ? 'text-white' : 'text-ink'}`}>
          <Highlight text={title} className={dark ? 'text-sky' : 'text-electric'} />
        </h2>
      )}
      {intro && (
        <p className={`mt-5 text-base leading-relaxed sm:text-lg ${dark ? 'text-haze' : 'text-slate'}`}>{intro}</p>
      )}
    </div>
  )
}
