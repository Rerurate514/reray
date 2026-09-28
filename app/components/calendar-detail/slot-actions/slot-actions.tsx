import type { AuthenticatedUser } from '../../../domain/user/entities/user'
import JoinSlotButton from '../../../islands/join-slot-button'
import type { Slot } from '../types/index'

export function SlotActions({
  capacity,
  currentUser,
  onJoined,
  slot,
}: {
  capacity: number
  currentUser: AuthenticatedUser | null
  onJoined?: () => void
  slot: Slot
}) {
  const hasJoined = currentUser !== null && slot.participants.some((entry) => entry.userId === currentUser.id)
  const isFull = slot.participants.length >= capacity

  if (hasJoined) {
    return (
      <div class="w-full shrink-0 sm:w-[7.5rem]">
        <form class="w-full" method="post" action={`/api/slots/${slot.id}/cancel`}>
          <button class="w-full border border-(--color-border-strong) px-4 py-2 text-sm font-semibold hover:border-(--color-accent) hover:text-(--color-accent)" type="submit">キャンセル</button>
        </form>
      </div>
    )
  }

  if (currentUser && !isFull) {
    return (
      <div class="w-full shrink-0 sm:w-[7.5rem]">
        <JoinSlotButton className="border border-(--color-accent) px-4 py-2 text-sm font-semibold text-(--color-accent) hover:bg-[#fff3ed] disabled:opacity-60" label="この日に参加する" onJoined={onJoined} slotId={slot.id} />
      </div>
    )
  }

  return (
    <div class="w-full shrink-0 sm:w-[7.5rem]">
      <button class="border border-(--color-border-strong) px-4 py-2 text-sm font-semibold text-(--color-muted)" type="button" disabled>
        {isFull ? '満員' : 'ログイン後に参加'}
      </button>
    </div>
  )
}
