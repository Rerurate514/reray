import type { CalendarRepository } from './repositories/calendarRepository'

export async function joinSlot(calendarRepository: CalendarRepository, input: { slotId: string; userId: string }) {
  const joined = await calendarRepository.joinSlot(input.slotId, input.userId, Date.now())
  if (!joined) {
    throw new Error('Slot is already taken')
  }
}
