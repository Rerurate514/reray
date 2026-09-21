import { SlotArticle } from '../slot-article/index'
import { SlotUser } from '../slot-user/index'
import type { Slot } from '../types/index'

export function AssignedSlot({ calendarSlug, isCurrentUserSlot, slot, isOnlyArticle }: { calendarSlug: string; isCurrentUserSlot: boolean; slot: Slot; isOnlyArticle: boolean }) {
  return (
    <>
      {!isOnlyArticle ? <SlotUser slot={slot} /> : null}
      {slot.description ? <p class="mt-2 whitespace-pre-wrap text-sm leading-7 text-(--color-muted)">{slot.description}</p> : null}
      <SlotArticle slot={slot} />
      {isCurrentUserSlot && !isOnlyArticle ? (
        <a class="mt-3 inline-block text-sm font-semibold text-(--color-muted) underline-offset-4 hover:text-(--color-accent) hover:underline" href={`/c/${calendarSlug}/slots/${slot.id}`}>枠ページで編集</a>
      ) : null}
    </>
  )
}
