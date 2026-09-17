import type { CalendarRepository } from './repositories/calendarRepository'

export async function listMySlots(calendarRepository: CalendarRepository, userId: string) {
  return calendarRepository.listSlotsByUser(userId)
}
