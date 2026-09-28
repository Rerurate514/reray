import { UserFacingError } from '../../domain/shared/errors/userFacingError'
import type { CalendarRepository } from './repositories/calendarRepository'

export async function deleteCalendar(calendarRepository: CalendarRepository, input: { calendarId: string; userId: string }) {
  const ownerId = await calendarRepository.findOwnerId(input.calendarId)
  if (!ownerId) {
    throw new UserFacingError('notFound', 'Calendar not found')
  }

  if (ownerId !== input.userId) {
    throw new UserFacingError('forbidden', 'Only the owner can delete this calendar')
  }

  const deleted = await calendarRepository.deleteCalendar(input.calendarId)
  if (!deleted) {
    throw new UserFacingError('notFound', 'Calendar not found')
  }
}
