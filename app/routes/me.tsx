import { createRoute } from 'honox/factory'
import type { PublicFirebaseConfig } from '../application/auth/firebaseConfig'
import { getPublicFirebaseConfig } from '../application/auth/firebaseConfig'
import type { CalendarSummary } from '../application/calendar/dtos/calendarSummary'
import type { MySlotSummary } from '../application/calendar/dtos/mySlotSummary'
import { listMyCalendars } from '../application/calendar/listMyCalendars'
import { listMySlots } from '../application/calendar/listMySlots'
import type { AuthenticatedUser } from '../domain/user/entities/user'
import AuthStatus from '../islands/auth-status'
import DeleteAccount from '../islands/delete-account'
import { getCurrentUser } from '../infrastructure/auth/currentUser'
import { createDrizzleCalendarRepository } from '../infrastructure/calendar/repositories/drizzleCalendarRepository'
import { createDb } from '../infrastructure/providers/db/client'

export default createRoute(async (c) => {
  const firebaseConfig = getPublicFirebaseConfig(c.env)
  const user = await getCurrentUser(c).catch(() => null)
  const calendarRepository = c.env.DB ? createDrizzleCalendarRepository(createDb(c.env.DB)) : null
  const mySlots = user && calendarRepository ? await listMySlots(calendarRepository, user.id) : []
  const myCalendars = user && calendarRepository ? await listMyCalendars(calendarRepository, user.id) : []
  const slotError = c.req.query('slot_error')
  const articleError = c.req.query('article_error')
  const profileError = c.req.query('profile_error')
  const profileSaved = c.req.query('profile_saved')

  return c.render(
    <MyPage
      articleError={articleError}
      firebaseConfig={firebaseConfig}
      myCalendars={myCalendars}
      mySlots={mySlots}
      profileError={profileError}
      profileSaved={profileSaved}
      slotError={slotError}
      user={user}
    />,
  )
})

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

function MyPage({ articleError, firebaseConfig, myCalendars, mySlots, profileError, profileSaved, slotError, user }: MyPageProps) {
  const error = slotError ?? articleError ?? profileError

  return (
    <main class="mx-auto min-h-screen w-full max-w-5xl px-5 py-6 sm:px-8">
      <title>自分の予定 - Reray</title>
      <PageHeader firebaseConfig={firebaseConfig} />
      {error ? <FeedbackMessage tone="error">{translateActionError(error)}</FeedbackMessage> : null}
      {profileSaved ? <FeedbackMessage tone="success">表示名を保存しました。</FeedbackMessage> : null}
      <section class="grid gap-10">
        <SectionNumber />
        <div class="border-t border-(--color-border) pt-6">
          <div class="bg-(--color-text) px-4 py-3 text-xl font-semibold tracking-tight text-(--color-page)">自分の予定</div>
          {user ? <SignedInContent firebaseConfig={firebaseConfig} myCalendars={myCalendars} mySlots={mySlots} user={user} /> : <p class="sr-only">ログイン後に自分の予定を表示します。</p>}
          <div class="reray-rule mt-8" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
        </div>
      </section>
    </main>
  )
}

function PageHeader({ firebaseConfig }: { firebaseConfig: PublicFirebaseConfig | null }) {
  return (
    <header class="mb-12 flex flex-col gap-4 border-b border-(--color-text) pb-5 sm:flex-row sm:items-center sm:justify-between">
      <a href="/" class="reray-wordmark text-xl font-semibold tracking-tight">Reray</a>
      <AuthStatus config={firebaseConfig} />
    </header>
  )
}

function FeedbackMessage({ children, tone }: { children: string; tone: 'error' | 'success' }) {
  return tone === 'error' ? (
    <div class="mb-8 border border-(--color-red) px-4 py-3 text-sm font-semibold text-(--color-red)">{children}</div>
  ) : (
    <div class="mb-8 border border-(--color-green) px-4 py-3 text-sm font-semibold text-(--color-green)">{children}</div>
  )
}

function SectionNumber() {
  return (
    <div class="flex items-baseline">
      <span class="text-6xl font-light leading-none text-(--color-accent)">01 /</span>
      <span class="mt-2 text-sm italic text-(--color-muted)">My Schedule</span>
    </div>
  )
}

function SignedInContent({ firebaseConfig, myCalendars, mySlots, user }: { firebaseConfig: PublicFirebaseConfig | null; myCalendars: CalendarSummary[]; mySlots: MySlotSummary[]; user: AuthenticatedUser }) {
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

function ProfileForm({ user }: { user: AuthenticatedUser }) {
  return (
    <form method="post" action="/api/account/profile" class="mt-8 grid gap-3 border-y border-(--color-border) py-6 sm:grid-cols-[1fr_auto] sm:items-end">
      <label class="grid gap-2">
        <span class="text-sm font-semibold">表示名</span>
        <input class="reray-input px-3 py-3" name="displayName" value={user.displayName} maxlength={40} required />
      </label>
      <button class="bg-(--color-text) px-4 py-3 text-sm font-semibold text-(--color-page) hover:bg-(--color-accent-hover)" type="submit">保存</button>
    </form>
  )
}

function MyCalendarsSection({ calendars }: { calendars: CalendarSummary[] }) {
  return (
    <section class="mt-8">
      <div class="flex items-center justify-between gap-4 border-b border-(--color-border) pb-3">
        <h2 class="text-lg font-semibold tracking-tight">作成したリレー</h2>
        <a class="text-sm font-semibold text-(--color-accent) hover:text-(--color-accent-hover)" href="/new">新規作成</a>
      </div>
      {calendars.length > 0 ? (
        <div class="mt-4 grid gap-4 sm:grid-cols-2">
          {calendars.map((calendar) => <MyCalendarCard calendar={calendar} />)}
        </div>
      ) : (
        <EmptyState
          actionHref="/new"
          actionLabel="リレーを作る"
          body="テーマと期間を決めると、投稿枠を自動で作成できます。公開リレーにも限定共有リレーにもできます。"
          title="まだ作成したリレーはありません"
          variant="primary"
        />
      )}
    </section>
  )
}

function MyCalendarCard({ calendar }: { calendar: CalendarSummary }) {
  return (
    <a class="grid min-h-40 border border-(--color-border) p-4 transition hover:bg-(--color-surface-muted)" href={`/c/${calendar.slug}`}>
      <div class="flex flex-wrap items-center gap-2 text-xs font-semibold text-(--color-muted)">
        <span class="border border-(--color-border) px-2 py-1">{calendar.visibility === 'private' ? '限定共有' : '公開'}</span>
        <span>{calendar.startDate} - {calendar.endDate}</span>
      </div>
      <h3 class="mt-4 text-xl font-semibold tracking-tight">{calendar.title}</h3>
      {calendar.tags.length > 0 ? (
        <div class="mt-4 flex flex-wrap gap-2">
          {calendar.tags.map((tag) => (
            <span class="border border-(--color-border) px-2 py-1 text-xs text-(--color-muted)">#{tag.name}</span>
          ))}
        </div>
      ) : null}
    </a>
  )
}

function MySlotsSection({ slots }: { slots: MySlotSummary[] }) {
  return (
    <section class="mt-10">
      <div class="border-b border-(--color-border) pb-3">
        <h2 class="text-lg font-semibold tracking-tight">参加している枠</h2>
      </div>
      {slots.length > 0 ? (
        <div class="mt-8 border-b border-(--color-border)">
          {slots.map((slot) => <MySlotItem slot={slot} />)}
        </div>
      ) : (
        <EmptyState
          actionHref="/"
          actionLabel="公開リレーを見る"
          body="公開リレーや共有された限定リレーの空き枠に参加すると、ここで記事URLを管理できます。"
          title="まだ担当している枠はありません"
          variant="secondary"
        />
      )}
    </section>
  )
}

function MySlotItem({ slot }: { slot: MySlotSummary }) {
  return (
    <article class="grid gap-4 border-t border-(--color-border) py-5">
      <div class="grid gap-2 sm:grid-cols-[9rem_1fr_auto] sm:items-start">
        <p class="text-sm font-semibold">{slot.scheduledDate ?? `#${slot.position}`}</p>
        <div>
          <a class="font-semibold text-(--color-accent) hover:text-(--color-accent-hover)" href={`/c/${slot.calendarSlug}`}>{slot.calendarTitle}</a>
          {slot.articleUrl ? (
            <a class="mt-1 block text-sm text-(--color-muted) underline-offset-4 hover:underline" href={slot.articleUrl} target="_blank" rel="noopener noreferrer">{slot.articleTitle}</a>
          ) : (
            <p class="mt-1 text-sm text-(--color-muted)">記事未登録</p>
          )}
        </div>
        <form method="post" action={`/api/slots/${slot.id}/cancel`}>
          <button class="border border-(--color-border-strong) px-3 py-2 text-sm font-semibold hover:border-(--color-accent) hover:text-(--color-accent)" type="submit">キャンセル</button>
        </form>
      </div>
      <form method="post" action={`/api/slots/${slot.id}/article`} class="grid gap-3 sm:grid-cols-[1fr_1.4fr_auto]">
        <input class="reray-input px-3 py-3" name="title" value={slot.articleTitle ?? ''} placeholder="記事タイトル（空ならURLから自動）" />
        <input class="reray-input px-3 py-3" name="url" value={slot.articleUrl ?? ''} placeholder="https://example.com/article" required />
        <button class="bg-(--color-text) px-4 py-3 text-sm font-semibold text-(--color-page) hover:bg-(--color-accent-hover)" type="submit">記事を保存</button>
      </form>
    </article>
  )
}

function EmptyState({ actionHref, actionLabel, body, title, variant }: { actionHref: string; actionLabel: string; body: string; title: string; variant: 'primary' | 'secondary' }) {
  const actionClass = variant === 'primary'
    ? 'bg-(--color-text) text-(--color-page) hover:bg-(--color-accent-hover)'
    : 'border border-(--color-border-strong) hover:border-(--color-accent) hover:text-(--color-accent)'

  return (
    <div class="mt-4 border-y border-dashed border-(--color-border-strong) py-8">
      <h3 class="text-xl font-semibold tracking-tight">{title}</h3>
      <p class="mt-3 max-w-2xl text-sm leading-7 text-(--color-muted)">{body}</p>
      <a class={`mt-5 inline-block px-5 py-3 text-sm font-semibold ${actionClass}`} href={actionHref}>{actionLabel}</a>
    </div>
  )
}

function translateActionError(message: string) {
  if (message === 'Authentication required') {
    return 'ログイン後に操作してください。'
  }

  if (message === 'Slot is not assigned to current user') {
    return 'この枠は現在のログインユーザーではキャンセルできません。ページを再読み込みしてログイン状態を確認してください。'
  }

  if (message.startsWith('Only the assigned user')) {
    return '記事を編集できるのは、この枠の担当者だけです。'
  }

  if (message === 'Display name is required') {
    return '表示名を入力してください。'
  }

  return '操作に失敗しました。ページを再読み込みしてもう一度試してください。'
}
