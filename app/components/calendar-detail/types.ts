import type { CalendarDetail } from '../../application/calendar/dtos/calendarDetail'

export type Calendar = CalendarDetail['calendar']
export type Slot = CalendarDetail['slots'][number]
