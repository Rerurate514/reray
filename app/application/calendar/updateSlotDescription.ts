import type { CalendarRepository } from './repositories/calendarRepository'
import { normalizeCalendarDescription } from '../../domain/calendar/services/normalizeCalendarDescription'

export async function updateSlotDescription(
  calendarRepository: CalendarRepository,
  input: { slotId: string; userId: string; description: string },
) {
  const entry = await calendarRepository.findEntryByUser({ slotId: input.slotId, userId: input.userId })
  if (!entry) {
    throw new Error('Only the assigned user can edit this notice')
  }

  const updated = await calendarRepository.updateSlotDescription({
    entryId: entry.id,
    description: normalizeCalendarDescription(input.description),
    now: Date.now(),
  })

  if (!updated) {
    throw new Error('Slot not found')
  }
}
