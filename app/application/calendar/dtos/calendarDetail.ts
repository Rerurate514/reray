export type CalendarDetail = {
  calendar: {
    id: string
    slug: string
    title: string
    description: string | null
    startDate: string | null
    endDate: string | null
    owner: {
      username: string
      avatarUrl: string | null
    }
  }
  slots: Array<{
    id: string
    scheduledDate: string | null
    position: number
    userId: string | null
    username: string | null
    displayName: string | null
    avatarUrl: string | null
    articleTitle: string | null
    articleUrl: string | null
  }>
}
