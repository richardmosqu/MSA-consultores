import Image from 'next/image'
import type { Media as MediaDoc } from '@/payload-types'

type Size = 'thumb' | 'card' | 'portrait' | 'wide'

/** Imagen subida al panel. Acepta el documento o su id (cuando no viene poblado → no pinta nada). */
export function MediaImage({
  media,
  size,
  alt,
  className = '',
  sizes = '100vw',
  priority = false,
  fill = true,
}: {
  media?: number | MediaDoc | null
  size?: Size
  alt?: string
  className?: string
  sizes?: string
  priority?: boolean
  fill?: boolean
}) {
  if (!media || typeof media === 'number') return null
  const variant = size ? media.sizes?.[size] : undefined
  const src = variant?.url || media.url
  if (!src) return null
  const focal =
    media.focalX != null && media.focalY != null ? `${media.focalX}% ${media.focalY}%` : undefined

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt ?? media.alt ?? ''}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover ${className}`}
        style={focal ? { objectPosition: focal } : undefined}
      />
    )
  }
  return (
    <Image
      src={src}
      alt={alt ?? media.alt ?? ''}
      width={variant?.width ?? media.width ?? 1200}
      height={variant?.height ?? media.height ?? 800}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  )
}

export const hasMedia = (media?: number | MediaDoc | null): media is MediaDoc =>
  !!media && typeof media === 'object' && !!media.url
