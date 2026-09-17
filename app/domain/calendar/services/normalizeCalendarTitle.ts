export function normalizeCalendarTitle(title: string) {
  const normalized = title.trim()
  if (normalized.length < 1 || normalized.length > 120) {
    throw new Error('Title is required')
  }

  return normalized
}
