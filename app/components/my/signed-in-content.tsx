import type { PublicFirebaseConfig } from '../../application/auth/firebaseConfig'
import type { CalendarSummary } from '../../application/calendar/dtos/calendarSummary'
import type { MySlotSummary } from '../../application/calendar/dtos/mySlotSummary'
import type { AuthenticatedUser } from '../../domain/user/entities/user'
import DeleteAccount from '../../islands/delete-account'
import { MyCalendarsSection } from './my-calendars-section'
import { MySlotsSection } from './my-slots-section'
import { ProfileForm } from './profile-form'

export function SignedInContent({
  firebaseConfig,
  myCalendars,
  mySlots,
  user,
}: {
  firebaseConfig: PublicFirebaseConfig | null
  myCalendars: CalendarSummary[]
  mySlots: MySlotSummary[]
  user: AuthenticatedUser
}) {
  return (
    <>
      <p class="mt-5 max-w-2xl leading-8 text-(--color-muted)">@{user.username} としてログインしています。</p>
      <ProfileForm user={user} />
      <MyCalendarsSection calendars={myCalendars} />
      <MySlotsSection slots={mySlots} />
      <DeleteAccount config={firebaseConfig} />
    </>
  )
}
