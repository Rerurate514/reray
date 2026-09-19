import type { PublicFirebaseConfig } from '../../../application/auth/firebaseConfig'
import type { CalendarSummary } from '../../../application/calendar/dtos/calendarSummary'
import type { MySlotSummary } from '../../../application/calendar/dtos/mySlotSummary'
import type { AuthenticatedUser } from '../../../domain/user/entities/user'
import DeleteAccount from '../../../islands/delete-account/delete-account'
import { GettingStartedPanel } from '../getting-started-panel/index'
import { MyCalendarsSection } from '../my-calendars-section/index'
import { MySlotsSection } from '../my-slots-section/index'
import { SlotReminderPanel } from '../slot-reminder-panel/index'

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
  const isEmpty = myCalendars.length < 1 && mySlots.length < 1

  return (
    <>
      <div class="mt-5 flex flex-col gap-3 border border-(--color-border) bg-[#fff8ed] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="min-w-0">
          <p class="text-sm font-semibold text-(--color-muted)">ログイン中</p>
          <p class="mt-1 truncate text-lg font-semibold">@{user.username}</p>
        </div>
        <a class="inline-block border border-(--color-border-strong) px-4 py-2 text-sm font-semibold hover:border-(--color-accent) hover:text-(--color-accent)" href={`/u/${user.username}`}>公開アカウントを見る</a>
      </div>
      {isEmpty ? <GettingStartedPanel /> : null}
      <SlotReminderPanel slots={mySlots} />
      <MyCalendarsSection calendars={myCalendars} />
      <MySlotsSection slots={mySlots} />
      <DeleteAccount config={firebaseConfig} />
    </>
  )
}
