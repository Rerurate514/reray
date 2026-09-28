import { UserFacingError } from '../../shared/errors/userFacingError'

export function normalizeCalendarTitle(title: string) {
  const normalized = title.trim()
  if (normalized.length < 1 || normalized.length > 120) {
    throw new UserFacingError('validation', 'Title is required')
  }

  return normalized
}
