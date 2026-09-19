import type { AuthenticatedUser } from '../../../domain/user/entities/user'
import JoinSlotButton from '../../../islands/join-slot-button'
import type { Slot } from '../types/index'

export function SlotActions({
  currentUser,
  isCurrentUserSlot,
  isOwner,
  slot,
}: {
  currentUser: AuthenticatedUser | null
  isCurrentUserSlot: boolean
  isOwner: boolean
  slot: Slot
}) {
  if (slot.userId) {
    return <AssignedSlotActions isCurrentUserSlot={isCurrentUserSlot} isOwner={isOwner} slot={slot} />
  }

  if (currentUser) {
    return (
      <div>
        <JoinSlotButton className="border border-(--color-accent) px-4 py-2 text-sm font-semibold text-(--color-accent) hover:bg-[#fff3ed] disabled:opacity-60" label="この日に参加する" slotId={slot.id} />
      </div>
    )
  }

  return (
    <div>
      <button class="border border-(--color-border-strong) px-4 py-2 text-sm font-semibold text-(--color-muted)" type="button" disabled>ログイン後に参加</button>
    </div>
  )
}

function AssignedSlotActions({ isCurrentUserSlot, isOwner, slot }: { isCurrentUserSlot: boolean; isOwner: boolean; slot: Slot }) {
  return (
    <div>
      <div class="flex flex-wrap gap-2">
        {isCurrentUserSlot ? (
          <form method="post" action={`/api/slots/${slot.id}/cancel`}>
            <button class="border border-(--color-border-strong) px-4 py-2 text-sm font-semibold hover:border-(--color-accent) hover:text-(--color-accent)" type="submit">キャンセル</button>
          </form>
        ) : null}
        {isOwner && !isCurrentUserSlot ? (
          <form method="post" action={`/api/slots/${slot.id}/clear`}>
            <button class="border border-(--color-red) px-4 py-2 text-sm font-semibold text-(--color-red) hover:bg-(--color-red) hover:text-(--color-page)" type="submit">担当を外す</button>
          </form>
        ) : null}
      </div>
    </div>
  )
}
