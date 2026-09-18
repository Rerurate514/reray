export function TagList({ tags }: { tags: Array<{ name: string }> }) {
  if (tags.length < 1) {
    return null
  }

  return (
    <div class="mt-5 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span class="border border-(--color-border) px-2 py-1 text-xs text-(--color-muted)">#{tag.name}</span>
      ))}
    </div>
  )
}
