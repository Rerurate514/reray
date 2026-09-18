import type { CalendarSummary } from '../../application/calendar/dtos/calendarSummary'
import type { PublicCalendarSearch, PublicCalendarStatusFilter } from '../../application/calendar/listPublicCalendars'
import { SectionNumber } from '../shared/section-number'
import { CalendarCard } from './calendar-card'

export function PublicCalendarsSection({ calendars, search }: { calendars: CalendarSummary[]; search: PublicCalendarSearch }) {
  const hasSearch = Boolean(search.query || search.tag || search.status !== 'all')

  return (
    <section class="grid gap-8 border-t border-(--color-border) py-12">
      <SectionNumber number="02 /" label="Public" />
      <div>
        <div class="flex items-center justify-between gap-4 border-b border-(--color-border) pb-4">
          <h2 class="reray-accent-letter text-2xl font-semibold tracking-tight">開催中のリレー</h2>
          <a class="text-sm font-semibold text-(--color-accent) hover:text-(--color-accent-hover)" href="/new">新規作成</a>
        </div>
        <PublicCalendarSearchForm search={search} />
        {calendars.length > 0 ? (
          <div class="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {calendars.map((calendar) => <CalendarCard calendar={calendar} />)}
          </div>
        ) : (
          <div class="mt-5 border-y border-dashed border-(--color-border-strong) py-8 text-(--color-muted)">
            {hasSearch ? '条件に合うリレーはありません。検索条件を変えて探せます。' : 'まだ公開中のリレーはありません。最初のリレーを作成できます。'}
          </div>
        )}
      </div>
    </section>
  )
}

function PublicCalendarSearchForm({ search }: { search: PublicCalendarSearch }) {
  return (
    <form class="mt-5 grid gap-3 border-b border-(--color-border) pb-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,.8fr)_auto_auto]" method="get" action="/">
      <label class="grid gap-2">
        <span class="text-xs font-semibold uppercase text-(--color-subtle)">Title</span>
        <input class="reray-input px-3 py-3" type="search" name="q" value={search.query} placeholder="タイトルで探す" />
      </label>
      <label class="grid gap-2">
        <span class="text-xs font-semibold uppercase text-(--color-subtle)">Tag</span>
        <input class="reray-input px-3 py-3" name="tag" value={search.tag} placeholder="flutter" />
      </label>
      <label class="grid gap-2">
        <span class="text-xs font-semibold uppercase text-(--color-subtle)">Status</span>
        <select class="reray-input px-3 py-3" name="status">
          <StatusOption value="all" label="すべて" current={search.status} />
          <StatusOption value="open" label="募集中" current={search.status} />
          <StatusOption value="upcoming" label="開催前" current={search.status} />
          <StatusOption value="ended" label="終了" current={search.status} />
        </select>
      </label>
      <div class="flex items-end gap-2">
        <button class="bg-(--color-text) px-4 py-3 text-sm font-semibold text-(--color-page) hover:bg-(--color-accent-hover)" type="submit">検索</button>
        <a class="border border-(--color-border-strong) px-4 py-3 text-sm font-semibold text-(--color-muted) hover:border-(--color-accent) hover:text-(--color-accent)" href="/">解除</a>
      </div>
    </form>
  )
}

function StatusOption({ current, label, value }: { current: PublicCalendarStatusFilter; label: string; value: PublicCalendarStatusFilter }) {
  return <option value={value} selected={current === value}>{label}</option>
}
