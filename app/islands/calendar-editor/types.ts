export type EditableCalendar = {
  id: string
  title: string
  description: string | null
  visibility: 'public' | 'private'
  tags: Array<{ name: string }>
}
