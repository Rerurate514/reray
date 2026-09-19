export type SlotDetail = {
  calendar: {
    id: string
    ownerId: string
    slug: string
    title: string
    visibility: 'public' | 'private'
  }
  slot: {
    id: string
    scheduledDate: string | null
    position: number
    description: string | null
    userId: string | null
    username: string | null
    displayName: string | null
    avatarUrl: string | null
    articleTitle: string | null
    articleUrl: string | null
  }
}
