import { SectionNumber } from '../shared/section-number'
import { TagList } from '../shared/tag-list'
import { OwnerBadge } from './owner-badge'
import type { Calendar } from './types'

export function OverviewSection({ calendar }: { calendar: Calendar }) {
  return (
    <section class="mb-12 grid gap-10">
      <div>
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
        <div class="reray-rule mt-8" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
      </div>
    </section>
  )
}
