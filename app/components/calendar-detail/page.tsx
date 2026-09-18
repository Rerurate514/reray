import type { PublicFirebaseConfig } from '../../application/auth/firebaseConfig'
import type { AuthenticatedUser } from '../../domain/user/entities/user'
import CalendarEditor from '../../islands/calendar-editor/calendar-editor'
import DeleteCalendar from '../../islands/delete-calendar/delete-calendar'
import { FeedbackMessage } from '../shared/feedback-message'
import { Footer } from '../shared/footer'
import { PageHeader } from '../shared/page-header'
import { CalendarGrid } from './calendar-grid'
import { OverviewSection } from './overview-section'
import { SlotsSection } from './slots-section'
import { translateCalendarActionError } from './translate-calendar-action-error'
import type { Calendar, Slot } from './types'

export function CalendarDetailPage({
  calendar,
  calendarError,
  calendarSaved,
  currentUser,
  firebaseConfig,
  slots,
  slotError,
}: {
  calendar: Calendar
  calendarError: string | undefined
  calendarSaved: string | undefined
  currentUser: AuthenticatedUser | null
  firebaseConfig: PublicFirebaseConfig | null
  slots: Slot[]
  slotError: string | undefined
}) {
  const isOwner = currentUser?.id === calendar.ownerId
  const error = slotError ?? calendarError

  return (
    <main class="mx-auto min-h-screen w-full max-w-6xl px-5 py-6 sm:px-8">
      <title>{calendar.title} - Reray</title>
      <PageHeader actions={<HeaderActions calendar={calendar} isOwner={isOwner} />} firebaseConfig={firebaseConfig} />
      {error ? <FeedbackMessage tone="error">{translateCalendarActionError(error)}</FeedbackMessage> : null}
      {calendarSaved ? <FeedbackMessage tone="success">リレーの内容を保存しました。</FeedbackMessage> : null}
      <OverviewSection calendar={calendar} />
      {isOwner ? <CalendarEditor calendar={calendar} /> : null}
      <CalendarGrid currentUser={currentUser} slots={slots} />
      <SlotsSection calendarTitle={calendar.title} currentUser={currentUser} isOwner={isOwner} slots={slots} />
      <Footer />
    </main>
  )
}

function HeaderActions({ calendar, isOwner }: { calendar: Calendar; isOwner: boolean }) {
  return (
    <>
      <a class="border border-(--color-border-strong) px-3 py-2 text-sm font-semibold hover:border-(--color-accent) hover:text-(--color-accent)" href="/">一覧</a>
      <a class="border border-(--color-border-strong) px-3 py-2 text-sm font-semibold hover:border-(--color-accent) hover:text-(--color-accent)" href="/new">作成</a>
      {isOwner ? <DeleteCalendar calendar={calendar} /> : null}
    </>
  )
}
