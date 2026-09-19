import type { AuthenticatedUser } from '../../../domain/user/entities/user'
import { SectionNumber } from '../../shared/section-number/index'
import { CalendarDay } from '../calendar-day/index'
import type { Slot } from '../types/index'
import { getUtcWeekday } from '../utc-date/index'

export function CalendarGrid({ currentUser, slots }: { currentUser: AuthenticatedUser | null; slots: Slot[] }) {
  const weekdayLabels = ['日', '月', '火', '水', '木', '金', '土']
  const firstScheduledDate = slots.find((slot) => slot.scheduledDate)?.scheduledDate
  const leadingBlankDays = firstScheduledDate ? getUtcWeekday(firstScheduledDate) : 0

  return (
    <section class="mb-12 mt-12 grid gap-6">
      <SectionNumber number="02 /" label="Calendar" />
      <div>
        <div class="grid grid-cols-7 border-l border-t border-(--color-border)">
          {weekdayLabels.map((label) => (
            <div class="border-b border-r border-(--color-border) px-2 py-2 text-center text-xs font-semibold text-(--color-muted)">{label}</div>
          ))}
          {Array.from({ length: leadingBlankDays }).map(() => (
            <div class="min-h-28 border-b border-r border-(--color-border) bg-(--color-surface-muted) opacity-55" aria-hidden="true"></div>
          ))}
          {slots.map((slot) => <CalendarDay currentUser={currentUser} slot={slot} />)}
        </div>
      </div>
    </section>
  )
}
