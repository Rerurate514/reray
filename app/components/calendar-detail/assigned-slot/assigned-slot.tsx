import { ParticipantEntry } from '../participant-entry/index'
import type { Slot } from '../types/index'

export function AssignedSlot({
  calendarSlug,
  currentUserId,
  isOwner,
  slot,
}: {
  calendarSlug: string
  currentUserId: string | null
  isOwner: boolean
  slot: Slot
}) {
  return (
    <div class="grid gap-3">
      {slot.participants.map((entry) => (
        <ParticipantEntry
          calendarSlug={calendarSlug}
          canRemove={isOwner && entry.userId !== currentUserId}
          entry={entry}
          isCurrentUser={currentUserId !== null && entry.userId === currentUserId}
          slotId={slot.id}
        />
      ))}
    </div>
  )
}
