import type { CalendarRepository } from './repositories/calendarRepository'

export async function cancelSlot(calendarRepository: CalendarRepository, input: { slotId: string; userId: string }) {
  const canceled = await calendarRepository.cancelSlot(input.slotId, input.userId, Date.now())
  if (!canceled) {
    throw new Error('Slot is not assigned to current user')
  }
}
