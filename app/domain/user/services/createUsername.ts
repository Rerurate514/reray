export function createUsername(seed: string) {
  const normalized = seed
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 24)

  return normalized || `user_${Date.now().toString(36)}`
}
