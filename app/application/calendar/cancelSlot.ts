import type { CalendarRepository } from './repositories/calendarRepository'

export async function cancelSlot(calendarRepository: CalendarRepository, input: { slotId: string; userId: string }) {
  const canceled = await calendarRepository.cancelSlot({
    slotId: input.slotId,
    userId: input.userId,
    now: Date.now(),
  })

  if (!canceled) {
    throw new Error('Slot is not assigned to current user')
  }
}
