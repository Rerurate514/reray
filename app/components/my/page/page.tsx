import type { PublicFirebaseConfig } from '../../../application/auth/firebaseConfig'
import type { CalendarSummary } from '../../../application/calendar/dtos/calendarSummary'
import type { MySlotSummary } from '../../../application/calendar/dtos/mySlotSummary'
import type { AuthenticatedUser } from '../../../domain/user/entities/user'
import { FeedbackMessage } from '../../shared/feedback-message/index'
import { Footer } from '../../shared/footer/index'
import { PageHeader } from '../../shared/page-header/index'
import { RerayRule } from '../../shared/reray-rule/index'
import { SectionNumber } from '../../shared/section-number/index'
import { SignedInContent } from '../signed-in-content/index'
import { SignedOutState } from '../signed-out-state/index'
import { translateMyPageError } from '../translate-my-page-error/index'

type MyPageProps = {
  articleError: string | undefined
  firebaseConfig: PublicFirebaseConfig | null
  myCalendars: CalendarSummary[]
  mySlots: MySlotSummary[]
  profileError: string | undefined
  profileSaved: string | undefined
  slotError: string | undefined
  user: AuthenticatedUser | null
}

export function MyPage({ articleError, firebaseConfig, myCalendars, mySlots, profileError, profileSaved, slotError, user }: MyPageProps) {
  const error = slotError ?? articleError ?? profileError

  return (
    <main class="mx-auto min-h-screen w-full max-w-5xl px-5 py-6 sm:px-8">
      <title>自分の予定 - Reray</title>
      <PageHeader firebaseConfig={firebaseConfig} />
      {error ? <FeedbackMessage tone="error">{translateMyPageError(error)}</FeedbackMessage> : null}
      {profileSaved ? <FeedbackMessage tone="success">表示名を保存しました。</FeedbackMessage> : null}
      <section class="grid gap-10">
        <SectionNumber number="01 /" label="My Schedule" large />
        <div class="border-t border-(--color-border) pt-6">
          <div class="bg-(--color-text) px-4 py-3 text-xl font-semibold tracking-tight text-(--color-page)">自分の予定</div>
          {user ? <SignedInContent firebaseConfig={firebaseConfig} myCalendars={myCalendars} mySlots={mySlots} user={user} /> : <SignedOutState />}
          <RerayRule class="mt-8" />
        </div>
      </section>
      <Footer />
    </main>
  )
}
