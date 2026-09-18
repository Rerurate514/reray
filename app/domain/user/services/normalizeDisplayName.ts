export function normalizeDisplayName(displayName: string) {
  const normalized = displayName.trim().replace(/\s+/g, ' ').slice(0, 40)
  if (normalized.length < 1) {
    throw new Error('Display name is required')
  }

  return normalized
}
