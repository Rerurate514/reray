import CalendarShare from '../../../islands/calendar-share'
import { RerayRule } from '../../shared/reray-rule/index'
import { SectionNumber } from '../../shared/section-number/index'
import { TagList } from '../../shared/tag-list/index'
import { OwnerBadge } from '../owner-badge/index'
import type { Calendar } from '../types/index'

export function OverviewSection({ calendar }: { calendar: Calendar }) {
  return (
    <section class="mb-12 grid gap-10">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <SectionNumber number="01 /" label="Overview" large />
        <OwnerBadge calendar={calendar} />
      </div>
      <div class="border-t border-(--color-border) pt-6">
        <div class="bg-(--color-text) px-4 py-3 text-sm font-semibold text-(--color-page) sm:text-base">
          {calendar.startDate} - {calendar.endDate}
          {calendar.visibility === 'private' ? <span class="ml-3 border border-(--color-page) px-2 py-1 text-xs">限定共有</span> : null}
        </div>
        <h1 class="mt-8 max-w-4xl text-4xl font-medium leading-tight tracking-tight sm:text-6xl">{calendar.title}</h1>
        <TagList tags={calendar.tags} />
        {calendar.description ? <p class="mt-6 max-w-2xl whitespace-pre-wrap leading-8 text-(--color-muted)">{calendar.description}</p> : null}
        <CalendarShare calendar={calendar} />
        <RerayRule class="mt-8" />
      </div>
    </section>
  )
}
