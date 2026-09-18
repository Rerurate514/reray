import type { NewCalendar } from '../../../domain/calendar/entities/calendar'
import type { NewSlot } from '../../../domain/calendar/entities/slot'
import type { CalendarDetail } from '../dtos/calendarDetail'
import type { CalendarSummary } from '../dtos/calendarSummary'
import type { MySlotSummary } from '../dtos/mySlotSummary'
import type { UpsertArticleInput } from '../dtos/upsertArticleInput'

export type PublicCalendarStatusFilter = 'all' | 'open' | 'upcoming' | 'ended'

export type PublicCalendarFilters = {
  query?: string
  tag?: string
  status?: PublicCalendarStatusFilter
  today?: string
}

export type CalendarRepository = {
  findSlugsByPrefix(baseSlug: string): Promise<string[]>
  createWithSlots(calendar: NewCalendar, slots: NewSlot[], tagNames: string[]): Promise<void>
  findDetailBySlug(slug: string): Promise<CalendarDetail | null>
  listPublishedPublic(limit: number, filters?: PublicCalendarFilters): Promise<CalendarSummary[]>
  listCalendarsByOwner(userId: string): Promise<CalendarSummary[]>
  findOwnerId(calendarId: string): Promise<string | null>
  updateCalendar(input: { calendarId: string; title: string; description: string | null; visibility: 'public' | 'private'; tagNames: string[]; now: number }): Promise<boolean>
  deleteCalendar(calendarId: string): Promise<boolean>
  joinSlot(slotId: string, userId: string, now: number): Promise<boolean>
  cancelSlot(slotId: string, userId: string, now: number): Promise<boolean>
  clearSlot(slotId: string, now: number): Promise<boolean>
  findSlotOwner(slotId: string): Promise<string | null>
  findSlotCalendarOwner(slotId: string): Promise<string | null>
  upsertArticle(input: UpsertArticleInput): Promise<void>
  listSlotsByUser(userId: string): Promise<MySlotSummary[]>
}
