import type { CalendarRepository } from './repositories/calendarRepository'
import { normalizeArticleUrl } from '../../domain/article/services/normalizeArticleUrl'

export async function updateSlotUrl(
  calendarRepository: CalendarRepository,
  input: { slotId: string; userId: string; url: string },
) {
  const ownerId = await calendarRepository.findSlotOwner(input.slotId)
  const calendarOwnerId = await calendarRepository.findSlotCalendarOwner(input.slotId)

  if (!ownerId && !calendarOwnerId) {
    throw new Error('Slot not found')
  }

  if (ownerId !== input.userId && calendarOwnerId !== input.userId) {
    throw new Error('Only the assigned user or calendar owner can edit this URL')
  }

  const trimmedUrl = input.url.trim()
  const updated = await calendarRepository.updateSlotUrl({
    slotId: input.slotId,
    url: trimmedUrl ? normalizeArticleUrl(trimmedUrl) : null,
    now: Date.now(),
  })

  if (!updated) {
    throw new Error('Slot not found')
  }
}
