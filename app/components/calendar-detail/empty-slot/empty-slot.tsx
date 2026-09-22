import SlotShareCard from '../../../islands/slot-share-card'
import type { Slot } from '../types/index'

export function EmptySlot({ calendarSlug, calendarTitle, slot }: { calendarSlug: string; calendarTitle: string; slot: Slot }) {
  const slotLabel = slot.scheduledDate ?? `#${slot.position}`

  return (
    <>
      <p class="font-semibold text-(--color-muted)">空き枠</p>
      <p class="mt-1 text-sm text-(--color-muted)">この日の担当者を募集中です。</p>
      <div class="mt-4">
        <SlotShareCard calendarTitle={calendarTitle} isRegistered={false} slotLabel={slotLabel} slotUrl={`/c/${calendarSlug}/slots/${slot.id}`} />
      </div>
      <a class="mt-3 inline-block text-sm font-semibold text-(--color-muted) underline-offset-4 hover:text-(--color-accent) hover:underline" href={`/c/${calendarSlug}/slots/${slot.id}`}>
        枠ページで編集
      </a>
    </>
  )
}