import type { NewCalendar } from '../../../domain/calendar/entities/calendar'
import type { NewSlot } from '../../../domain/calendar/entities/slot'

export type CalendarSummary = {
  id: string
  slug: string
  title: string
  startDate: string | null
  endDate: string | null
  owner: {
    username: string
  }
}

export type CalendarDetail = {
  calendar: {
    id: string
    slug: string
    title: string
    description: string | null
    startDate: string | null
    endDate: string | null
    owner: {
      username: string
    }
  }
  slots: Array<{
    id: string
    scheduledDate: string | null
    position: number
    userId: string | null
    username: string | null
    displayName: string | null
    articleTitle: string | null
    articleUrl: string | null
  }>
}

export type CalendarRepository = {
  findSlugsByPrefix(baseSlug: string): Promise<string[]>
  createWithSlots(calendar: NewCalendar, slots: NewSlot[]): Promise<void>
  findDetailBySlug(slug: string): Promise<CalendarDetail | null>
  listPublishedPublic(limit: number): Promise<CalendarSummary[]>
}
