import type { Slot } from '../types/index'

export function SlotArticle({ compact = false, slot }: { compact?: boolean; slot: Slot }) {
  if (!slot.articleUrl) {
    return <p class={compact ? 'text-xs text-(--color-muted)' : 'mt-1 text-(--color-muted)'}>記事準備中...</p>
  }

  if (compact) {
    return (
      <a class="line-clamp-2 text-xs font-semibold text-(--color-accent) underline-offset-4 hover:text-(--color-accent-hover) hover:underline" href={slot.articleUrl} rel="noopener noreferrer" target="_blank">
        {slot.articleTitle}
      </a>
    )
  }

  return (
    <div class="mt-2 min-w-0 border border-(--color-border) bg-[#fff8ed] p-3">
      <p class="text-xs font-semibold uppercase text-(--color-subtle)">Article</p>
      <a class="mt-1 block truncate font-semibold text-(--color-accent) underline-offset-4 hover:text-(--color-accent-hover) hover:underline" href={slot.articleUrl} rel="noopener noreferrer" target="_blank">
        {slot.articleTitle}
      </a>
      <p class="mt-1 max-w-full truncate text-xs text-(--color-muted)">{slot.articleUrl}</p>
    </div>
  )
}
