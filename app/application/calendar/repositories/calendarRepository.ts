import type { NewCalendar } from '../../../domain/calendar/entities/calendar'
import type { NewSlot } from '../../../domain/calendar/entities/slot'
import type { CalendarDetail } from '../dtos/calendarDetail'
import type { CalendarSummary } from '../dtos/calendarSummary'
import type { MySlotSummary } from '../dtos/mySlotSummary'
import type { UpsertArticleInput } from '../dtos/upsertArticleInput'

export type CalendarRepository = {
  findSlugsByPrefix(baseSlug: string): Promise<string[]>
  createWithSlots(calendar: NewCalendar, slots: NewSlot[]): Promise<void>
  findDetailBySlug(slug: string): Promise<CalendarDetail | null>
  listPublishedPublic(limit: number): Promise<CalendarSummary[]>
  findOwnerId(calendarId: string): Promise<string | null>
  deleteCalendar(calendarId: string): Promise<boolean>
  joinSlot(slotId: string, userId: string, now: number): Promise<boolean>
  cancelSlot(slotId: string, userId: string, now: number): Promise<boolean>
  findSlotOwner(slotId: string): Promise<string | null>
  upsertArticle(input: UpsertArticleInput): Promise<void>
  listSlotsByUser(userId: string): Promise<MySlotSummary[]>
}
