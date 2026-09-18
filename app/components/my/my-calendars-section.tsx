import type { CalendarSummary } from '../../application/calendar/dtos/calendarSummary'
import { EmptyState } from './empty-state'
import { MyCalendarCard } from './my-calendar-card'

export function MyCalendarsSection({ calendars }: { calendars: CalendarSummary[] }) {
  return (
    <section class="mt-8">
      <div class="flex items-center justify-between gap-4 border-b border-(--color-border) pb-3">
        <h2 class="text-lg font-semibold tracking-tight">作成したリレー</h2>
        <a class="text-sm font-semibold text-(--color-accent) hover:text-(--color-accent-hover)" href="/new">新規作成</a>
      </div>
      {calendars.length > 0 ? (
        <div class="mt-4 grid gap-4 sm:grid-cols-2">
          {calendars.map((calendar) => <MyCalendarCard calendar={calendar} />)}
        </div>
      ) : (
        <EmptyState
          actionHref="/new"
          actionLabel="リレーを作る"
          body="テーマと期間を決めると、投稿枠を自動で作成できます。公開リレーにも限定共有リレーにもできます。"
          title="まだ作成したリレーはありません"
          variant="primary"
        />
      )}
    </section>
  )
}
