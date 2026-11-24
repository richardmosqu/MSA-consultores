import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

/**
 * El sitio se sirve en caché (ISR). Cuando el equipo guarda algo en el panel,
 * invalidamos todo el front: es un sitio pequeño y así nunca queda nada desfasado.
 */
async function revalidateAll(context: Record<string, unknown> | undefined) {
  if (context?.disableRevalidate) return
  try {
    const { revalidatePath } = await import('next/cache')
    revalidatePath('/', 'layout')
  } catch {
    // Fuera de Next (p. ej. el script de seed) no hay nada que invalidar.
  }
}

export const revalidateSite: CollectionAfterChangeHook & CollectionAfterDeleteHook = async ({
  doc,
  req,
}) => {
  await revalidateAll(req.context)
  return doc
}

export const revalidateGlobal: GlobalAfterChangeHook = async ({ doc, req }) => {
  await revalidateAll(req.context)
  return doc
}
