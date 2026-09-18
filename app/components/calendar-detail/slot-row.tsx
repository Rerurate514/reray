import type { AuthenticatedUser } from '../../domain/user/entities/user'
import { AssignedSlot } from './assigned-slot'
import { EmptySlot } from './empty-slot'
import { SlotActions } from './slot-actions'
import type { Slot } from './types'

export function SlotRow({
  currentUser,
  isOwner,
  slot,
}: {
  currentUser: AuthenticatedUser | null
  isOwner: boolean
  slot: Slot
}) {
  const isCurrentUserSlot = currentUser?.id === slot.userId

  return (
    <article class="grid gap-3 border-t border-(--color-border) py-4 sm:grid-cols-[7rem_1fr_auto] sm:items-start">
      <div>
        <p class="text-sm font-semibold">{slot.scheduledDate ?? `#${slot.position}`}</p>
      </div>
      <div>
        {slot.userId ? <AssignedSlot slot={slot} isCurrentUserSlot={isCurrentUserSlot} /> : <EmptySlot />}
      </div>
      <SlotActions currentUser={currentUser} isCurrentUserSlot={isCurrentUserSlot} isOwner={isOwner} slot={slot} />
    </article>
  )
}
