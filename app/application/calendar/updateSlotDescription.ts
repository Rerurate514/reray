import type { CalendarRepository } from './repositories/calendarRepository'
import { normalizeCalendarDescription } from '../../domain/calendar/services/normalizeCalendarDescription'

export async function updateSlotDescription(
  calendarRepository: CalendarRepository,
  input: { slotId: string; userId: string; description: string },
) {
  const ownerId = await calendarRepository.findSlotOwner(input.slotId)
  const calendarOwnerId = await calendarRepository.findSlotCalendarOwner(input.slotId)

  if (!ownerId && !calendarOwnerId) {
    throw new Error('Slot not found')
  }

  if (ownerId !== input.userId && calendarOwnerId !== input.userId) {
    throw new Error('Only the assigned user or calendar owner can edit this notice')
  }

  const updated = await calendarRepository.updateSlotDescription({
    slotId: input.slotId,
    description: normalizeCalendarDescription(input.description),
    now: Date.now(),
  })

  if (!updated) {
    throw new Error('Slot not found')
  }
}
