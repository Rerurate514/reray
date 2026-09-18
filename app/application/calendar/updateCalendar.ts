import { normalizeCalendarDescription } from '../../domain/calendar/services/normalizeCalendarDescription'
import { normalizeCalendarTitle } from '../../domain/calendar/services/normalizeCalendarTitle'
import { normalizeCalendarVisibility } from '../../domain/calendar/services/normalizeCalendarVisibility'
import { normalizeTagNames } from '../../domain/tag/services/normalizeTagNames'
import type { CalendarRepository } from './repositories/calendarRepository'

export async function updateCalendar(
  calendarRepository: CalendarRepository,
  input: { calendarId: string; userId: string; title: string; description?: string; visibility?: string; tags?: string },
) {
  const ownerId = await calendarRepository.findOwnerId(input.calendarId)
  if (!ownerId) {
    throw new Error('Calendar not found')
  }

  if (ownerId !== input.userId) {
    throw new Error('Only the owner can edit this calendar')
  }

  const updated = await calendarRepository.updateCalendar({
    calendarId: input.calendarId,
    title: normalizeCalendarTitle(input.title),
    description: normalizeCalendarDescription(input.description),
    visibility: normalizeCalendarVisibility(input.visibility),
    tagNames: normalizeTagNames(input.tags),
    now: Date.now(),
  })

  if (!updated) {
    throw new Error('Calendar not found')
  }
}
