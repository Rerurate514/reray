import type { AuthenticatedUser } from '../../../domain/user/entities/user'
import { AssignedSlot } from '../assigned-slot/index'
import { EmptySlot } from '../empty-slot/index'
import { SlotActions } from '../slot-actions/index'
import type { Slot } from '../types/index'

export function SlotRow({
  calendarTitle,
  calendarSlug,
  currentUser,
  isOwner,
  onJoined,
  slot,
}: {
  calendarTitle: string
  calendarSlug: string
  currentUser: AuthenticatedUser | null
  isOwner: boolean
  onJoined?: () => void
  slot: Slot
}) {
  const isCurrentUserSlot = currentUser?.id === slot.userId

  return (
    <article class="grid gap-3 border-t border-(--color-border) py-4 sm:grid-cols-[7rem_minmax(0,1fr)_7.5rem] sm:items-start">
      <div class="min-w-0">
        <p class="text-sm font-semibold">{slot.scheduledDate ?? `#${slot.position}`}</p>
      </div>
      <div class="min-w-0">
        {slot.userId ? <AssignedSlot calendarSlug={calendarSlug} slot={slot} isCurrentUserSlot={isCurrentUserSlot} /> : <EmptySlot calendarSlug={calendarSlug} calendarTitle={calendarTitle} slot={slot} />}
      </div>
      <SlotActions currentUser={currentUser} isCurrentUserSlot={isCurrentUserSlot} isOwner={isOwner} onJoined={onJoined} slot={slot} />
    </article>
  )
}
