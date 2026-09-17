import type { UserId } from '../../user/valueObjects/userId'
import type { CalendarId } from '../valueObjects/calendarId'
import type { CalendarStatus } from '../valueObjects/calendarStatus'
import type { CalendarVisibility } from '../valueObjects/calendarVisibility'

export type NewCalendar = {
  id: CalendarId
  ownerId: UserId
  slug: string
  title: string
  description: string | null
  startDate: string
  endDate: string
  visibility: CalendarVisibility
  status: CalendarStatus
  createdAt: number
  updatedAt: number
}
