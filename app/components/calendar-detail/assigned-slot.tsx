import { SlotUser } from './slot-user'
import type { Slot } from './types'

export function AssignedSlot({ isCurrentUserSlot, slot }: { isCurrentUserSlot: boolean; slot: Slot }) {
  return (
    <>
      <SlotUser slot={slot} />
      {slot.articleUrl ? (
        <a class="mt-1 block text-(--color-accent) underline-offset-4 hover:text-(--color-accent-hover) hover:underline" href={slot.articleUrl} rel="noopener noreferrer" target="_blank">
          {slot.articleTitle}
        </a>
      ) : (
        <p class="mt-1 text-(--color-muted)">記事準備中...</p>
      )}
      {isCurrentUserSlot ? (
        <a class="mt-3 inline-block text-sm font-semibold text-(--color-muted) underline-offset-4 hover:text-(--color-accent) hover:underline" href="/me">自分の予定で編集</a>
      ) : null}
    </>
  )
}
