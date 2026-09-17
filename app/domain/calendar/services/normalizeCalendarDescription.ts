export function normalizeCalendarDescription(description?: string) {
  const normalized = description?.trim()
  return normalized ? normalized : null
}
