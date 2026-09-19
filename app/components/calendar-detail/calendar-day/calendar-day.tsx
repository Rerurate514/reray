import type { AuthenticatedUser } from '../../../domain/user/entities/user'
import { SlotDate } from '../slot-date/index'
import { SlotArticle } from '../slot-article/index'
import { SlotUser } from '../slot-user/index'
import type { Slot } from '../types/index'
import { getUtcDate } from '../utc-date/index'

export function CalendarDay({ currentUser, slot }: { currentUser: AuthenticatedUser | null; slot: Slot }) {
  const day = slot.scheduledDate ? getUtcDate(slot.scheduledDate) : slot.position

  if (slot.userId) {
    return (
      <div class="min-h-28 border-b border-r border-(--color-border) bg-(--color-surface) p-2">
        <div class="flex h-full flex-col justify-between gap-3">
          <SlotDate day={day} scheduledDate={slot.scheduledDate} />
          <div class="grid gap-2">
            <SlotUser slot={slot} compact />
            <SlotArticle slot={slot} compact />
          </div>
        </div>
      </div>
    )
  }

  if (currentUser) {
    return (
      <div class="min-h-28 border-b border-r border-(--color-border) bg-(--color-surface) p-2">
        <form method="post" action={`/api/slots/${slot.id}/join`} class="h-full">
          <button class="flex h-full w-full flex-col justify-between gap-3 text-left hover:text-(--color-accent)" type="submit">
            <SlotDate day={day} scheduledDate={slot.scheduledDate} />
            <span class="text-sm font-semibold text-(--color-accent)">参加する</span>
          </button>
        </form>
      </div>
    )
  }

  return (
    <div class="min-h-28 border-b border-r border-(--color-border) bg-(--color-surface) p-2">
      <div class="flex h-full flex-col justify-between gap-3 text-(--color-muted)">
        <SlotDate day={day} scheduledDate={slot.scheduledDate} />
        <span class="text-sm font-semibold">ログイン後に参加できます</span>
      </div>
    </div>
  )
}
