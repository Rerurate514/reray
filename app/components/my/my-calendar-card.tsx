import type { CalendarSummary } from '../../application/calendar/dtos/calendarSummary'
import { TagList } from '../shared/tag-list'

export function MyCalendarCard({ calendar }: { calendar: CalendarSummary }) {
  return (
    <a class="grid min-h-40 border border-(--color-border) p-4 transition hover:bg-(--color-surface-muted)" href={`/c/${calendar.slug}`}>
      <div class="flex flex-wrap items-center gap-2 text-xs font-semibold text-(--color-muted)">
        <span class="border border-(--color-border) px-2 py-1">{calendar.visibility === 'private' ? '限定共有' : '公開'}</span>
        <span>{calendar.startDate} - {calendar.endDate}</span>
      </div>
      <h3 class="mt-4 text-xl font-semibold tracking-tight">{calendar.title}</h3>
      <TagList tags={calendar.tags} />
    </a>
  )
}
