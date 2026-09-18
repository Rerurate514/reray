export type CalendarSummary = {
  id: string
  slug: string
  title: string
  startDate: string | null
  endDate: string | null
  tags: Array<{ name: string }>
  owner: {
    username: string
    displayName: string
    avatarUrl: string | null
  }
}
