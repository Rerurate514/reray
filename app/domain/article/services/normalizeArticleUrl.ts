export function normalizeArticleUrl(url: string) {
  const normalized = url.trim()

  try {
    const parsed = new URL(normalized)
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      throw new Error('Article URL must start with http or https')
    }

    return parsed.toString()
  } catch {
    throw new Error('Article URL must be a valid http or https URL')
  }
}
