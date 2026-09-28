import { UserFacingError } from '../../shared/errors/userFacingError'

export function normalizeArticleTitle(title: string) {
  const normalized = title.trim()
  if (normalized.length < 1 || normalized.length > 160) {
    throw new UserFacingError('validation', 'Article title is required')
  }

  return normalized
}
