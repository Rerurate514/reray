import { UserFacingError } from '../../shared/errors/userFacingError'

const maxDescriptionLength = 2000

export function normalizeCalendarDescription(description?: string) {
  const normalized = description?.trim()
  if (!normalized) {
    return null
  }

  if (normalized.length > maxDescriptionLength) {
    throw new UserFacingError('validation', `Description must be ${maxDescriptionLength} characters or fewer`)
  }

  return normalized
}
