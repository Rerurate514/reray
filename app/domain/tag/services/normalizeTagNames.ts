const MAX_TAGS = 8
const MAX_TAG_LENGTH = 24

export function normalizeTagNames(input: string | string[] | undefined) {
  const values = Array.isArray(input) ? input : String(input ?? '').split(',')
  const tags: string[] = []
  const seen = new Set<string>()

  for (const value of values) {
    const name = normalizeTagName(value)
    if (!name || seen.has(name)) {
      continue
    }

    tags.push(name)
    seen.add(name)

    if (tags.length >= MAX_TAGS) {
      break
    }
  }

  return tags
}

function normalizeTagName(input: string) {
  const name = input.trim().replace(/^#/, '').replace(/\s+/g, ' ')
  if (!name) {
    return null
  }

  if (name.length > MAX_TAG_LENGTH) {
    throw new Error(`Tag must be ${MAX_TAG_LENGTH} characters or less`)
  }

  return name.toLowerCase()
}
