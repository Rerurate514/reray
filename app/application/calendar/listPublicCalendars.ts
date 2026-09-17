import type { CalendarRepository } from './repositories/calendarRepository'

export async function listPublicCalendars(calendarRepository: CalendarRepository) {
  return calendarRepository.listPublishedPublic(12)
}
