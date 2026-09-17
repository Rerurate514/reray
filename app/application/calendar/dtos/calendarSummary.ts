export type CalendarSummary = {
  id: string
  slug: string
  title: string
  startDate: string | null
  endDate: string | null
  owner: {
    username: string
  }
}
