import { normalizeTagNames } from '../../domain/tag/services/normalizeTagNames'
import type { CalendarRepository, PublicCalendarStatusFilter } from './repositories/calendarRepository'

export type ListPublicCalendarsInput = {
  query?: string
  tag?: string
  status?: string
}

export type PublicCalendarSearch = {
  query: string
  tag: string
  status: PublicCalendarStatusFilter
}

export async function listPublicCalendars(calendarRepository: CalendarRepository, input: ListPublicCalendarsInput = {}) {
  const search = normalizePublicCalendarSearch(input)
  const calendars = await calendarRepository.listPublishedPublic(24, {
    query: search.query || undefined,
    tag: search.tag || undefined,
    status: search.status,
    today: formatToday(),
  })

  return { calendars, search }
}

function normalizePublicCalendarSearch(input: ListPublicCalendarsInput): PublicCalendarSearch {
  const query = String(input.query ?? '').trim().slice(0, 80)
  const tag = normalizeTagNames(input.tag)[0] ?? ''
  const status = normalizeStatus(input.status)

  return { query, tag, status }
}

function normalizeStatus(value: string | undefined): PublicCalendarStatusFilter {
  if (value === 'open' || value === 'upcoming' || value === 'ended') {
    return value
  }

  return 'all'
}

function formatToday() {
  return new Date().toISOString().slice(0, 10)
}
