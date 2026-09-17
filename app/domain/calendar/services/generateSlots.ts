import type { GeneratedSlot } from '../entities/slot'
import type { SlotFrequency } from '../valueObjects/slotFrequency'

export function generateSlots(startDate: string, endDate: string, frequency: SlotFrequency) {
  const start = parseDate(startDate)
  const end = parseDate(endDate)

  if (!start || !end || start > end) {
    throw new Error('Invalid date range')
  }

  const slots: GeneratedSlot[] = []
  const current = new Date(start)

  while (current <= end) {
    const day = current.getUTCDay()
    const isWeekday = day >= 1 && day <= 5

    if (frequency === 'daily' || isWeekday) {
      slots.push({
        scheduledDate: formatDate(current),
        position: slots.length + 1,
      })
    }

    current.setUTCDate(current.getUTCDate() + 1)
  }

  if (slots.length === 0) {
    throw new Error('No slots generated')
  }

  return slots
}

function parseDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null
  }

  const date = new Date(`${value}T00:00:00.000Z`)
  return Number.isNaN(date.getTime()) ? null : date
}

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10)
}
