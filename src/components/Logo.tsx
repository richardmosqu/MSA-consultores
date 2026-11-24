// Versión provisional del logotipo, armada en código a partir de las piezas de Instagram.
// Cuando MSA entregue el logo en vector (SVG/AI), se reemplaza por el archivo oficial.
export function Logo({ className = '', compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2.5 leading-none ${className}`} aria-label="MSA — Mateos Saint Malo & Asociados">
      <span className="font-serif text-[1.9em] font-medium tracking-[0.02em]" aria-hidden>
        MSA
      </span>
      {!compact && (
        <>
          <span className="h-[2.1em] w-px bg-current opacity-80" aria-hidden />
          <span className="relative font-serif text-[0.62em] leading-[1.08]" aria-hidden>
            Mateos
            <br />
            Saint Malo
            <br />& Asociados
            <span className="absolute -top-1 -right-3 font-sans text-[0.75em]">®</span>
          </span>
        </>
      )}
    </span>
  )
}
