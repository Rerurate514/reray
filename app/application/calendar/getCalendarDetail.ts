import type { CalendarRepository } from './repositories/calendarRepository'

export async function getCalendarDetail(calendarRepository: CalendarRepository, slug: string) {
  return calendarRepository.findDetailBySlug(slug)
}
