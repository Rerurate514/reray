import type { CalendarSummary } from '../../../application/calendar/dtos/calendarSummary'
import { TagList } from '../../shared/tag-list/index'

export function CalendarCard({ calendar }: { calendar: CalendarSummary }) {
  return (
    <article class="relative grid min-h-48 border border-(--color-border) p-4 transition hover:bg-(--color-surface-muted)">
      <a
        class="absolute inset-0"
        href={`/c/${calendar.slug}`}
        aria-label={`${calendar.title}を開く`}
      />
      <a
        class="relative z-10 flex w-fit items-center gap-2 text-sm text-(--color-subtle) hover:text-(--color-accent)"
        href={`/u/${calendar.owner.username}`}
      >
        {calendar.owner.avatarUrl ? (
          <img
            class="h-6 w-6 rounded-full border border-(--color-border-strong) object-cover"
            src={calendar.owner.avatarUrl}
            alt={calendar.owner.displayName}
          />
        ) : (
          <span class="grid h-6 w-6 place-items-center rounded-full border border-(--color-border-strong) text-xs">
            {calendar.owner.displayName.slice(0, 1)}
          </span>
        )}
        <span>{calendar.owner.displayName}</span>
      </a>

      <h3 class="mt-4 text-xl font-semibold tracking-tight">
        {calendar.title}
      </h3>
      <div class="mb-4">
        <TagList tags={calendar.tags} />
      </div>

      <p class="mt-auto border-t border-(--color-border) pt-3 text-sm text-(--color-muted)">
        {calendar.startDate} - {calendar.endDate}
      </p>
    </article>
  )
}
