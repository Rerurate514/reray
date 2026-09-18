import type { AuthenticatedUser } from '../../domain/user/entities/user'
import { SectionNumber } from '../shared/section-number'
import { SlotRow } from './slot-row'
import type { Slot } from './types'

export function SlotsSection({
  currentUser,
  isOwner,
  slots,
}: {
  currentUser: AuthenticatedUser | null
  isOwner: boolean
  slots: Slot[]
}) {
  return (
    <section class="grid gap-6">
      <SectionNumber number="03 /" label="Slots" />
      <div class="border-b border-(--color-border)">
        {slots.map((slot) => <SlotRow currentUser={currentUser} isOwner={isOwner} slot={slot} />)}
      </div>
    </section>
  )
}
