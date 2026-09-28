export type EditableCalendar = {
  id: string
  title: string
  description: string | null
  visibility: 'public' | 'private'
  capacity: number
  tags: Array<{ name: string }>
}
