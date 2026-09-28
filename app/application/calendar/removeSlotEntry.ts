import { UserFacingError } from '../../domain/shared/errors/userFacingError'
import type { CalendarRepository } from './repositories/calendarRepository'

export async function removeSlotEntry(calendarRepository: CalendarRepository, input: { entryId: string; userId: string }) {
  const ownerId = await calendarRepository.findEntryCalendarOwner(input.entryId)
  if (!ownerId) {
    throw new UserFacingError('notFound', 'Participant not found')
  }

  if (ownerId !== input.userId) {
    throw new UserFacingError('forbidden', 'Only the owner can remove this participant')
  }

  const removed = await calendarRepository.removeSlotEntry({ entryId: input.entryId, now: Date.now() })
  if (!removed) {
    throw new UserFacingError('notFound', 'Participant not found')
  }
}
