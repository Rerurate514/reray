import { SlotArticle } from '../slot-article/index'
import { SlotUser } from '../slot-user/index'
import type { Slot } from '../types/index'

export function AssignedSlot({ isCurrentUserSlot, slot }: { isCurrentUserSlot: boolean; slot: Slot }) {
  return (
    <>
      <SlotUser slot={slot} />
      {slot.description ? <p class="mt-2 whitespace-pre-wrap text-sm leading-7 text-(--color-muted)">{slot.description}</p> : null}
      <SlotArticle slot={slot} />
      {isCurrentUserSlot ? (
        <a class="mt-3 inline-block text-sm font-semibold text-(--color-muted) underline-offset-4 hover:text-(--color-accent) hover:underline" href="/me">自分の予定で編集</a>
      ) : null}
    </>
  )
}
