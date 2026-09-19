import type { AuthenticatedUser } from '../../../domain/user/entities/user'
import { SlotDate } from '../slot-date/index'
import { SlotUser } from '../slot-user/index'
import type { Slot } from '../types/index'
import { getUtcDate } from '../utc-date/index'

export function CalendarDay({ calendarSlug, currentUser, slot }: { calendarSlug: string; currentUser: AuthenticatedUser | null; slot: Slot }) {
  const day = slot.scheduledDate ? getUtcDate(slot.scheduledDate) : slot.position

  if (slot.userId) {
    return (
      <div class="min-h-28 border-b border-r border-(--color-border) bg-(--color-surface) p-2">
        <div class="grid h-full content-start gap-2">
          <SlotDate day={day} scheduledDate={slot.scheduledDate} />
          <a class="text-xs font-semibold text-(--color-accent) hover:text-(--color-accent-hover)" href={`/c/${calendarSlug}/slots/${slot.id}`}>詳細</a>
          <SlotUser slot={slot} compact />
        </div>
      </div>
    )
  }

  if (currentUser) {
    return (
      <div class="min-h-28 border-b border-r border-(--color-border) bg-(--color-surface) p-2">
        <div class="grid h-full content-start gap-2">
          <SlotDate day={day} scheduledDate={slot.scheduledDate} />
          <a class="text-xs font-semibold text-(--color-muted) hover:text-(--color-accent)" href={`/c/${calendarSlug}/slots/${slot.id}`}>詳細</a>
          <form method="post" action={`/api/slots/${slot.id}/join`}>
            <button class="text-left text-sm font-semibold text-(--color-accent) hover:text-(--color-accent-hover)" type="submit">参加する</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div class="min-h-28 border-b border-r border-(--color-border) bg-(--color-surface) p-2">
      <div class="grid h-full content-start gap-2 text-(--color-muted)">
        <SlotDate day={day} scheduledDate={slot.scheduledDate} />
        <a class="text-xs font-semibold text-(--color-accent)" href={`/c/${calendarSlug}/slots/${slot.id}`}>詳細</a>
      </div>
    </div>
  )
}
