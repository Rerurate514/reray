import type { CalendarRepository } from './repositories/calendarRepository'

export async function listMyCalendars(calendarRepository: CalendarRepository, userId: string) {
  return calendarRepository.listCalendarsByOwner(userId)
}
