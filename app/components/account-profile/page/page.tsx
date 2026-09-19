import type { CalendarSummary } from '../../../application/calendar/dtos/calendarSummary'
import type { MySlotSummary } from '../../../application/calendar/dtos/mySlotSummary'
import type { PublicFirebaseConfig } from '../../../application/auth/firebaseConfig'
import type { AuthenticatedUser } from '../../../domain/user/entities/user'
import { CalendarCard } from '../../home/calendar-card/index'
import { EmptyState } from '../../my/empty-state/index'
import { ProfileForm } from '../../my/profile-form/index'
import { translateMyPageError } from '../../my/translate-my-page-error/index'
import { FeedbackMessage } from '../../shared/feedback-message/index'
import { Footer } from '../../shared/footer/index'
import { PageHeader } from '../../shared/page-header/index'
import { RerayRule } from '../../shared/reray-rule/index'
import { SectionNumber } from '../../shared/section-number/index'

type AccountProfilePageProps = {
  calendars: CalendarSummary[]
  currentUser: AuthenticatedUser | null
  firebaseConfig: PublicFirebaseConfig | null
  profileError: string | undefined
  profileSaved: string | undefined
  profileUser: AuthenticatedUser
  slots: MySlotSummary[]
}

export function AccountProfilePage({ calendars, currentUser, firebaseConfig, profileError, profileSaved, profileUser, slots }: AccountProfilePageProps) {
  const isOwnAccount = currentUser?.id === profileUser.id

  return (
    <main class="mx-auto min-h-screen w-full max-w-5xl px-5 py-6 sm:px-8">
      <title>{profileUser.displayName} - Reray</title>
      <PageHeader firebaseConfig={firebaseConfig} />
      {profileError ? <FeedbackMessage tone="error">{translateMyPageError(profileError)}</FeedbackMessage> : null}
      {profileSaved ? <FeedbackMessage tone="success">表示名を保存しました。</FeedbackMessage> : null}
      <section class="grid gap-10">
        <SectionNumber number="01 /" label="Account" large />
        <div class="border-t border-(--color-border) pt-6">
          <ProfileHero user={profileUser} />
          {isOwnAccount ? <ProfileForm user={profileUser} /> : null}
          <RerayRule class="mt-8" />
          <CreatedCalendarsSection calendars={calendars} />
          <JoinedSlotsSection slots={slots} />
        </div>
      </section>
      <Footer />
    </main>
  )
}

function ProfileHero({ user }: { user: AuthenticatedUser }) {
  return (
    <div class="grid gap-5 bg-(--color-text) px-5 py-5 text-(--color-page) sm:grid-cols-[auto_1fr] sm:items-center">
      {user.avatarUrl ? (
        <img class="h-16 w-16 rounded-full border border-(--color-page) object-cover" src={user.avatarUrl} alt={user.displayName} />
      ) : (
        <span class="grid h-16 w-16 place-items-center rounded-full border border-(--color-page) text-2xl font-semibold">{user.displayName.slice(0, 1)}</span>
      )}
      <div class="min-w-0">
        <h1 class="truncate text-3xl font-medium tracking-tight sm:text-5xl">{user.displayName}</h1>
        <p class="mt-2 text-sm font-semibold text-(--color-surface-muted)">@{user.username}</p>
      </div>
    </div>
  )
}

function CreatedCalendarsSection({ calendars }: { calendars: CalendarSummary[] }) {
  return (
    <section class="mt-10">
      <div class="border-b border-(--color-border) pb-3">
        <h2 class="text-lg font-semibold tracking-tight">作成した公開カレンダー</h2>
      </div>
      {calendars.length > 0 ? (
        <div class="mt-4 grid gap-4 sm:grid-cols-2">
          {calendars.map((calendar) => <CalendarCard calendar={calendar} />)}
        </div>
      ) : (
        <EmptyState actionHref="/" actionLabel="公開カレンダーを見る" body="公開中のカレンダーはまだありません。" title="公開カレンダーはありません" variant="secondary" />
      )}
    </section>
  )
}

function JoinedSlotsSection({ slots }: { slots: MySlotSummary[] }) {
  return (
    <section class="mt-10">
      <div class="border-b border-(--color-border) pb-3">
        <h2 class="text-lg font-semibold tracking-tight">参加した公開枠</h2>
      </div>
      {slots.length > 0 ? (
        <div class="mt-6 border-b border-(--color-border)">
          {slots.map((slot) => <PublicSlotItem slot={slot} />)}
        </div>
      ) : (
        <EmptyState actionHref="/" actionLabel="公開カレンダーを見る" body="公開カレンダーで参加している枠はまだありません。" title="参加した公開枠はありません" variant="secondary" />
      )}
    </section>
  )
}

function PublicSlotItem({ slot }: { slot: MySlotSummary }) {
  return (
    <article class="grid gap-3 border-t border-(--color-border) py-5 sm:grid-cols-[8rem_1fr_auto] sm:items-start">
      <p class="text-sm font-semibold">{slot.scheduledDate ?? `#${slot.position}`}</p>
      <div class="min-w-0">
        <a class="font-semibold text-(--color-accent) hover:text-(--color-accent-hover)" href={`/c/${slot.calendarSlug}`}>{slot.calendarTitle}</a>
        {slot.description ? <p class="mt-2 whitespace-pre-wrap text-sm leading-7 text-(--color-muted)">{slot.description}</p> : null}
        {slot.articleUrl ? (
          <a class="mt-2 block truncate text-sm font-semibold underline-offset-4 hover:text-(--color-accent) hover:underline" href={slot.articleUrl} target="_blank" rel="noopener noreferrer">
            {slot.articleTitle ?? slot.articleUrl}
          </a>
        ) : (
          <p class="mt-2 text-sm text-(--color-muted)">記事準備中</p>
        )}
      </div>
      <a class="inline-block border border-(--color-border-strong) px-3 py-2 text-sm font-semibold hover:border-(--color-accent) hover:text-(--color-accent)" href={`/c/${slot.calendarSlug}/slots/${slot.id}`}>枠ページ</a>
    </article>
  )
}
