import type { SlotParticipant } from './slotParticipant'

export type CalendarDetail = {
  calendar: {
    id: string
    ownerId: string
    slug: string
    title: string
    description: string | null
    startDate: string | null
    endDate: string | null
    visibility: 'public' | 'private'
    capacity: number
    tags: Array<{ name: string }>
    owner: {
      username: string
      displayName: string
      avatarUrl: string | null
    }
  }
  slots: Array<{
    id: string
    scheduledDate: string | null
    position: number
    participants: SlotParticipant[]
  }>
}
