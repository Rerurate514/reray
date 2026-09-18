import type { CalendarRepository } from './repositories/calendarRepository'
import type { SlotFrequency } from '../../domain/calendar/valueObjects/slotFrequency'
import { generateCalendarSlug } from '../../domain/calendar/services/generateCalendarSlug'
import { generateSlots } from '../../domain/calendar/services/generateSlots'
import { normalizeCalendarDescription } from '../../domain/calendar/services/normalizeCalendarDescription'
import { normalizeCalendarTitle } from '../../domain/calendar/services/normalizeCalendarTitle'
import { normalizeCalendarVisibility } from '../../domain/calendar/services/normalizeCalendarVisibility'
import { normalizeTagNames } from '../../domain/tag/services/normalizeTagNames'
import { createId } from '../../domain/shared/services/createId'

export type CreateCalendarInput = {
  ownerId: string
  title: string
  description?: string
  startDate: string
  endDate: string
  frequency: SlotFrequency
  visibility?: string
  tags?: string
}

export async function createCalendar(calendarRepository: CalendarRepository, input: CreateCalendarInput) {
  const title = normalizeCalendarTitle(input.title)
  const now = Date.now()
  const id = createId('cal')
  const baseSlug = generateCalendarSlug(title)
  const slug = await createUniqueSlug(calendarRepository, baseSlug)
  const generatedSlots = generateSlots(input.startDate, input.endDate, input.frequency)
  const tagNames = normalizeTagNames(input.tags)

  await calendarRepository.createWithSlots(
    {
      id,
      ownerId: input.ownerId,
      slug,
      title,
      description: normalizeCalendarDescription(input.description),
      startDate: input.startDate,
      endDate: input.endDate,
      visibility: normalizeCalendarVisibility(input.visibility),
      status: 'published',
      createdAt: now,
      updatedAt: now,
    },
    generatedSlots.map((slot) => ({
      id: createId('slot'),
      calendarId: id,
      userId: null,
      scheduledDate: slot.scheduledDate,
      position: slot.position,
      createdAt: now,
      updatedAt: now,
    })),
    tagNames,
  )

  return { id, slug }
}

async function createUniqueSlug(calendarRepository: CalendarRepository, baseSlug: string) {
  const slugs = await calendarRepository.findSlugsByPrefix(baseSlug)

  if (!slugs.includes(baseSlug)) {
    return baseSlug
  }

  for (let suffix = 2; suffix < 1000; suffix += 1) {
    const candidate = `${baseSlug}-${suffix}`
    if (!slugs.includes(candidate)) {
      return candidate
    }
  }

  return `${baseSlug}-${Date.now()}`
}
