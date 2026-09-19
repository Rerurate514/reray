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
    userId: string | null
    description: string | null
    username: string | null
    displayName: string | null
    avatarUrl: string | null
    articleTitle: string | null
    articleUrl: string | null
  }>
}
