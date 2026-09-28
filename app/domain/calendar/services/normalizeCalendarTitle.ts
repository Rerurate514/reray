import { UserFacingError } from '../../shared/errors/userFacingError'

const maxTitleLength = 120

export function normalizeCalendarTitle(title: string) {
  const normalized = title.trim()
  if (normalized.length < 1) {
    throw new UserFacingError('validation', 'Title is required')
  }

  if (normalized.length > maxTitleLength) {
    throw new UserFacingError('validation', `Title must be ${maxTitleLength} characters or fewer`)
  }

  return normalized
}
