import type { CalendarRepository } from './repositories/calendarRepository'

export async function getSlotDetail(calendarRepository: CalendarRepository, input: { calendarSlug: string; slotId: string }) {
  return calendarRepository.findSlotDetail(input.calendarSlug, input.slotId)
}
