import SlotShare from '../../../islands/slot-share/slot-share'
import type { Slot } from '../types/index'

export function EmptySlot({ calendarTitle, slot }: { calendarTitle: string; slot: Slot }) {
  const slotLabel = slot.scheduledDate ?? `#${slot.position}`

  return (
    <>
      <p class="font-semibold text-(--color-muted)">空き枠</p>
      <p class="mt-1 text-sm text-(--color-muted)">この日の担当者を募集中です。</p>
      <SlotShare calendarTitle={calendarTitle} slotLabel={slotLabel} />
    </>
  )
}
