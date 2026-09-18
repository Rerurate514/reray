import type { CalendarVisibility } from '../valueObjects/calendarVisibility'

export function normalizeCalendarVisibility(visibility: string | undefined): CalendarVisibility {
  return visibility === 'private' ? 'private' : 'public'
}
