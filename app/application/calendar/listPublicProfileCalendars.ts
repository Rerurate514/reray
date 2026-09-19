import type { CalendarRepository } from './repositories/calendarRepository'

export async function listPublicProfileCalendars(calendarRepository: CalendarRepository, userId: string) {
  return calendarRepository.listPublishedPublicByOwner(userId)
}
