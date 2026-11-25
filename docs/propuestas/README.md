# Propuestas de diseño

Presentación para MSA: [MSA-propuestas-de-diseno.pdf](MSA-propuestas-de-diseno.pdf) (fuente: [index.html](index.html), capturas en `img/`).

| Propuesta | Concepto | Dónde vive en el código |
| --- | --- | --- |
| **A · Impacto** | Fiel a su Instagram: azul intenso, mayúsculas gruesas, diagonales, stickers | Commit `94884be` (estructura distinta; no convive con B y C) |
| **B · Cercana** | Paneles redondeados, mucho aire, Outfit, azul de MSA como acento | Diseño por defecto |
| **C · Editorial** | Serif (Playfair), esquinas rectas, líneas finas, fondo papel, portada clara, secciones numeradas | `data-design="editorial"` (reglas al final de `globals.css`) |

## Ver B y C en vivo

B y C comparten código: los componentes usan tokens (`rounded-card`, `rounded-dot`, `bg-surface`, `font-display`…) y cada
propuesta solo cambia sus valores.

- Por defecto se publica la que diga la variable `NEXT_PUBLIC_DESIGN` (`cercana` o `editorial`; sin valor = `cercana`).
- Para la revisión con MSA, cualquier enlace con `?diseno=editorial` o `?diseno=cercana` cambia la propuesta y la recuerda
  al navegar; aparece un selector "Propuesta B / C" abajo a la izquierda. `?diseno=reset` vuelve a la normal.

## Cuando MSA elija

- **B o C:** fijar `NEXT_PUBLIC_DESIGN`, y después limpiar: borrar las reglas de la propuesta descartada en `globals.css`,
  `DesignSwitcher.tsx` y el script de `layout.tsx`.
- **A:** recuperar los componentes del commit `94884be` (header, footer, bloques, tarjetas y `globals.css`) sobre la
  rama actual; el contenido, el panel y la navegación de servicios no cambian.
