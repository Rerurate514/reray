import type { Calendar, Slot } from '../types/index'

export type NextOpenSlotText = {
  label: string
  value: string
}

export function createCalendarPreviewDescription(calendar: Calendar) {
  const parts = [
    calendar.description?.trim(),
    createDateRangeText(calendar),
    calendar.tags.length > 0 ? calendar.tags.map((tag) => `#${tag.name}`).join(' ') : null,
  ].filter(Boolean)

  return trimUtf8(parts.join('\n'), 340)
}

export function createDateRangeText(calendar: Calendar) {
  if (calendar.startDate && calendar.endDate) {
    return `${calendar.startDate} - ${calendar.endDate}`
  }

  return calendar.startDate ?? calendar.endDate ?? null
}

export function createNextOpenSlotText(slots: Slot[]): NextOpenSlotText {
  const openSlot = slots
    .filter((slot) => !slot.userId)
    .sort((a, b) => {
      if (a.scheduledDate && b.scheduledDate) {
        return a.scheduledDate.localeCompare(b.scheduledDate) || a.position - b.position
      }

      if (a.scheduledDate) {
        return -1
      }

      if (b.scheduledDate) {
        return 1
      }

      return a.position - b.position
    })[0]

  if (!openSlot) {
    return {
      label: '直近の空き枠',
      value: 'ありません',
    }
  }

  return {
    label: '直近の空き枠',
    value: openSlot.scheduledDate ?? `#${openSlot.position}`,
  }
}

export function createTagText(calendar: Calendar) {
  if (calendar.tags.length === 0) {
    return null
  }

  return calendar.tags.map((tag) => `\`${escapeDiscordMarkdown(tag.name)}\``).join(' ')
}

export function trimUtf8(value: string, maxBytes: number) {
  const encoder = new TextEncoder()

  if (encoder.encode(value).length <= maxBytes) {
    return value
  }

  let result = ''

  for (const char of value) {
    const next = `${result}${char}`
    if (encoder.encode(`${next}…`).length > maxBytes) {
      return `${result}…`
    }
    result = next
  }

  return result
}

export function escapeDiscordMarkdown(value: string) {
  return value.replace(/([\\`*_{}[\]()#+\-.!|>])/g, '\\$1')
}
