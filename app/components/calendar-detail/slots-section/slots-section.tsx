import type { AuthenticatedUser } from '../../../domain/user/entities/user'
import { SectionNumber } from '../../shared/section-number/index'
import { SlotRow } from '../slot-row/index'
import type { Slot } from '../types/index'

export function SlotsSection({
  calendarTitle,
  calendarSlug,
  currentUser,
  isOwner,
  slots,
}: {
  calendarTitle: string
  calendarSlug: string
  currentUser: AuthenticatedUser | null
  isOwner: boolean
  slots: Slot[]
}) {
  return (
    <section class="grid gap-6">
      <SectionNumber number="03 /" label="Slots" />
      <div class="border-b border-(--color-border)">
        {slots.map((slot) => <SlotRow calendarSlug={calendarSlug} calendarTitle={calendarTitle} currentUser={currentUser} isOwner={isOwner} slot={slot} />)}
      </div>
    </section>
  )
}
