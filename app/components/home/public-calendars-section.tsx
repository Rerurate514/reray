import type { CalendarSummary } from '../../application/calendar/dtos/calendarSummary'
import { SectionNumber } from '../shared/section-number'
import { CalendarCard } from './calendar-card'

export function PublicCalendarsSection({ calendars }: { calendars: CalendarSummary[] }) {
  return (
    <section class="grid gap-8 border-t border-(--color-border) py-12">
      <SectionNumber number="02 /" label="Public" />
      <div>
        <div class="flex items-center justify-between gap-4 border-b border-(--color-border) pb-4">
          <h2 class="reray-accent-letter text-2xl font-semibold tracking-tight">開催中のリレー</h2>
          <a class="text-sm font-semibold text-(--color-accent) hover:text-(--color-accent-hover)" href="/new">新規作成</a>
        </div>
        {calendars.length > 0 ? (
          <div class="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {calendars.map((calendar) => <CalendarCard calendar={calendar} />)}
          </div>
        ) : (
          <div class="mt-5 border-y border-dashed border-(--color-border-strong) py-8 text-(--color-muted)">
            まだ公開中のリレーはありません。最初のリレーを作成できます。
          </div>
        )}
      </div>
    </section>
  )
}
