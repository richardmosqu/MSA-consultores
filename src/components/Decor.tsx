// Recursos gráficos de las piezas de MSA: cortes diagonales azules y trama de puntos.

export function Shards({ className = '', line = false }: { className?: string; line?: boolean }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div
        className="absolute -top-24 right-[-10%] h-[70%] w-[55%] bg-gradient-to-bl from-electric/70 via-navy-2/40 to-transparent"
        style={{ clipPath: 'polygon(35% 0, 100% 0, 100% 100%, 0 100%)' }}
      />
      {line && (
        <div className="absolute top-0 right-[18%] h-[120%] w-[3px] origin-top rotate-[28deg] bg-gradient-to-b from-sky/0 via-sky/70 to-sky/0" />
      )}
      <div
        className="absolute bottom-[-30%] left-[-15%] h-[70%] w-[60%] bg-gradient-to-tr from-ink/80 to-transparent"
        style={{ clipPath: 'polygon(0 30%, 100% 100%, 0 100%)' }}
      />
      <div
        className="absolute right-0 bottom-0 h-[38%] w-[30%] bg-gradient-to-tl from-electric/50 to-transparent"
        style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}
      />
    </div>
  )
}

export function Dots({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`dots pointer-events-none absolute text-sky/50 [mask-image:radial-gradient(circle_at_top_left,black,transparent_70%)] ${className}`}
    />
  )
}
