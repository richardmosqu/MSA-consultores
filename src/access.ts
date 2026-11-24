import type { Access, FieldAccess } from 'payload'

type Role = 'admin' | 'editor'
const roleOf = (user: unknown): Role | undefined =>
  (user as { role?: Role } | null | undefined)?.role

export const anyone: Access = () => true
export const authenticated: Access = ({ req }) => Boolean(req.user)
export const isAdmin: Access = ({ req }) => roleOf(req.user) === 'admin'
export const isAdminField: FieldAccess = ({ req }) => roleOf(req.user) === 'admin'

/** Público ve solo lo publicado; el equipo de MSA ve también los borradores. */
export const publishedOrAuthenticated: Access = ({ req }) => {
  if (req.user) return true
  return { _status: { equals: 'published' } }
}

export const isAdminOrSelf: Access = ({ req }) => {
  if (roleOf(req.user) === 'admin') return true
  if (!req.user) return false
  return { id: { equals: req.user.id } }
}
