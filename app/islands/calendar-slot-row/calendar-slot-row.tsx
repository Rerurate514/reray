import { useState } from 'hono/jsx'
import type { AuthenticatedUser } from '../../domain/user/entities/user'
import { SlotRow } from '../../components/calendar-detail/slot-row'
import type { Slot } from '../../components/calendar-detail/types'

type Props = {
  calendarSlug: string
  calendarTitle: string
  currentUser: AuthenticatedUser
  isOwner: boolean
  slot: Slot
}

export default function CalendarSlotRow({ calendarSlug, calendarTitle, currentUser, isOwner, slot }: Props) {
  const [currentSlot, setCurrentSlot] = useState(slot)

  function markJoined() {
    setCurrentSlot({
      ...currentSlot,
      userId: currentUser.id,
      username: currentUser.username,
      displayName: currentUser.displayName,
      avatarUrl: currentUser.avatarUrl,
      articleTitle: null,
      articleUrl: null,
    })
  }

  return (
    <SlotRow
      calendarSlug={calendarSlug}
      calendarTitle={calendarTitle}
      currentUser={currentUser}
      isOwner={isOwner}
      onJoined={markJoined}
      slot={currentSlot}
    />
  )
}
