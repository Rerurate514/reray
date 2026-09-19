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
  slot,
}: {
  calendarTitle: string
  calendarSlug: string
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
        {slot.userId ? <AssignedSlot calendarSlug={calendarSlug} slot={slot} isCurrentUserSlot={isCurrentUserSlot} /> : <EmptySlot calendarSlug={calendarSlug} calendarTitle={calendarTitle} slot={slot} />}
      </div>
      <SlotActions currentUser={currentUser} isCurrentUserSlot={isCurrentUserSlot} isOwner={isOwner} slot={slot} />
    </article>
  )
}
