export function normalizeArticleTitle(title: string) {
  const normalized = title.trim()
  if (normalized.length < 1 || normalized.length > 160) {
    throw new Error('Article title is required')
  }

  return normalized
}
