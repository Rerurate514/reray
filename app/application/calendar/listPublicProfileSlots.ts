import type { CalendarRepository } from './repositories/calendarRepository'

export async function listPublicProfileSlots(calendarRepository: CalendarRepository, userId: string) {
  return calendarRepository.listPublishedPublicSlotsByUser(userId)
}
