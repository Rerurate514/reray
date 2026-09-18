import type { CalendarRepository } from './repositories/calendarRepository'

export async function clearSlotAssignment(calendarRepository: CalendarRepository, input: { slotId: string; userId: string }) {
  const ownerId = await calendarRepository.findSlotCalendarOwner(input.slotId)
  if (!ownerId) {
    throw new Error('Slot not found')
  }

  if (ownerId !== input.userId) {
    throw new Error('Only the owner can clear this slot')
  }

  const cleared = await calendarRepository.clearSlot(input.slotId, Date.now())
  if (!cleared) {
    throw new Error('Slot is already empty')
  }
}
