import { createRoute } from 'honox/factory'
import type { PublicFirebaseConfig } from '../../../application/auth/firebaseConfig'
import { getPublicFirebaseConfig } from '../../../application/auth/firebaseConfig'
import type { CalendarDetail } from '../../../application/calendar/dtos/calendarDetail'
import { getCalendarDetail } from '../../../application/calendar/getCalendarDetail'
import type { AuthenticatedUser } from '../../../domain/user/entities/user'
import AuthStatus from '../../../islands/auth-status'
import CalendarEditor from '../../../islands/calendar-editor'
import DeleteCalendar from '../../../islands/delete-calendar'
import { getCurrentUser } from '../../../infrastructure/auth/currentUser'
import { createDrizzleCalendarRepository } from '../../../infrastructure/calendar/repositories/drizzleCalendarRepository'
import { createDb } from '../../../infrastructure/providers/db/client'

type Calendar = CalendarDetail['calendar']
type Slot = CalendarDetail['slots'][number]

export default createRoute(async (c) => {
  const slug = c.req.param('slug')

  if (!slug) {
    c.status(404)
    return c.render('Calendar not found')
  }

  if (!c.env.DB) {
    c.status(500)
    return c.render('D1 database binding is not configured')
  }

  const detail = await getCalendarDetail(createDrizzleCalendarRepository(createDb(c.env.DB)), slug)

  if (!detail) {
    c.status(404)
    return c.render('Calendar not found')
  }

  const { calendar, slots } = detail
  const firebaseConfig = getPublicFirebaseConfig(c.env)
  const currentUser = await getCurrentUser(c).catch(() => null)
  const slotError = c.req.query('slot_error')
  const articleError = c.req.query('article_error')
  const calendarError = c.req.query('calendar_error')
  const calendarSaved = c.req.query('calendar_saved')

  return c.render(
    <CalendarDetailPage
      calendar={calendar}
      calendarError={calendarError}
      calendarSaved={calendarSaved}
      currentUser={currentUser}
      firebaseConfig={firebaseConfig}
      slots={slots}
      slotError={slotError ?? articleError}
    />,
  )
})

function CalendarDetailPage({
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
      <PageHeader calendar={calendar} firebaseConfig={firebaseConfig} isOwner={isOwner} />
      {error ? <FeedbackMessage tone="error">{translateActionError(error)}</FeedbackMessage> : null}
      {calendarSaved ? <FeedbackMessage tone="success">リレーの内容を保存しました。</FeedbackMessage> : null}
      <OverviewSection calendar={calendar} />
      {isOwner ? <CalendarEditor calendar={calendar} /> : null}
      <CalendarGrid currentUser={currentUser} slots={slots} />
      <SlotsSection currentUser={currentUser} isOwner={isOwner} slots={slots} />
    </main>
  )
}

function PageHeader({ calendar, firebaseConfig, isOwner }: { calendar: Calendar; firebaseConfig: PublicFirebaseConfig | null; isOwner: boolean }) {
  return (
    <header class="mb-12 flex flex-col gap-4 border-b border-(--color-text) pb-5 sm:flex-row sm:items-center sm:justify-between">
      <a href="/" class="reray-wordmark text-xl font-semibold tracking-tight">Reray</a>
      <div class="flex flex-wrap items-center gap-2">
        <a class="border border-(--color-border-strong) px-3 py-2 text-sm font-semibold hover:border-(--color-accent) hover:text-(--color-accent)" href="/">一覧</a>
        <a class="border border-(--color-border-strong) px-3 py-2 text-sm font-semibold hover:border-(--color-accent) hover:text-(--color-accent)" href="/new">作成</a>
        {isOwner ? <DeleteCalendar calendar={calendar} /> : null}
        <AuthStatus config={firebaseConfig} />
      </div>
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

function OverviewSection({ calendar }: { calendar: Calendar }) {
  return (
    <section class="mb-12 grid gap-10">
      <div>
        <SectionNumber number="01 /" label="Overview" large />
        <OwnerBadge calendar={calendar} />
      </div>
      <div class="border-t border-(--color-border) pt-6">
        <div class="bg-(--color-text) px-4 py-3 text-sm font-semibold text-(--color-page) sm:text-base">
          {calendar.startDate} - {calendar.endDate}
          {calendar.visibility === 'private' ? <span class="ml-3 border border-(--color-page) px-2 py-1 text-xs">限定共有</span> : null}
        </div>
        <h1 class="mt-8 max-w-4xl text-4xl font-medium leading-tight tracking-tight sm:text-6xl">{calendar.title}</h1>
        <TagList tags={calendar.tags} />
        {calendar.description ? <p class="mt-6 max-w-2xl whitespace-pre-wrap leading-8 text-(--color-muted)">{calendar.description}</p> : null}
        <div class="reray-rule mt-8" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
      </div>
    </section>
  )
}

function OwnerBadge({ calendar }: { calendar: Calendar }) {
  return (
    <div class="mt-3 flex items-center gap-2 text-sm italic text-(--color-muted)">
      {calendar.owner.avatarUrl ? (
        <img class="h-6 w-6 rounded-full border border-(--color-border-strong) object-cover" src={calendar.owner.avatarUrl} alt={calendar.owner.displayName} />
      ) : (
        <span class="grid h-6 w-6 place-items-center rounded-full border border-(--color-border-strong) text-xs not-italic">{calendar.owner.displayName.slice(0, 1)}</span>
      )}
      <span>{calendar.owner.displayName}</span>
    </div>
  )
}

function CalendarGrid({ currentUser, slots }: { currentUser: AuthenticatedUser | null; slots: Slot[] }) {
  const weekdayLabels = ['日', '月', '火', '水', '木', '金', '土']
  const firstScheduledDate = slots.find((slot) => slot.scheduledDate)?.scheduledDate
  const leadingBlankDays = firstScheduledDate ? getUtcWeekday(firstScheduledDate) : 0

  return (
    <section class="mb-12 mt-12 grid gap-6">
      <SectionNumber number="02 /" label="Calendar" />
      <div>
        <div class="grid grid-cols-7 border-l border-t border-(--color-border)">
          {weekdayLabels.map((label) => (
            <div class="border-b border-r border-(--color-border) px-2 py-2 text-center text-xs font-semibold text-(--color-muted)">{label}</div>
          ))}
          {Array.from({ length: leadingBlankDays }).map(() => (
            <div class="min-h-28 border-b border-r border-(--color-border) bg-(--color-surface-muted) opacity-55" aria-hidden="true"></div>
          ))}
          {slots.map((slot) => <CalendarDay currentUser={currentUser} slot={slot} />)}
        </div>
      </div>
    </section>
  )
}

function CalendarDay({ currentUser, slot }: { currentUser: AuthenticatedUser | null; slot: Slot }) {
  const day = slot.scheduledDate ? getUtcDate(slot.scheduledDate) : slot.position

  if (slot.userId) {
    return (
      <div class="min-h-28 border-b border-r border-(--color-border) bg-(--color-surface) p-2">
        <div class="flex h-full flex-col justify-between gap-3">
          <SlotDate day={day} scheduledDate={slot.scheduledDate} />
          <SlotUser slot={slot} compact />
        </div>
      </div>
    )
  }

  if (currentUser) {
    return (
      <div class="min-h-28 border-b border-r border-(--color-border) bg-(--color-surface) p-2">
        <form method="post" action={`/api/slots/${slot.id}/join`} class="h-full">
          <button class="flex h-full w-full flex-col justify-between gap-3 text-left hover:text-(--color-accent)" type="submit">
            <SlotDate day={day} scheduledDate={slot.scheduledDate} />
            <span class="text-sm font-semibold text-(--color-accent)">参加する</span>
          </button>
        </form>
      </div>
    )
  }

  return (
    <div class="min-h-28 border-b border-r border-(--color-border) bg-(--color-surface) p-2">
      <div class="flex h-full flex-col justify-between gap-3 text-(--color-muted)">
        <SlotDate day={day} scheduledDate={slot.scheduledDate} />
        <span class="text-sm font-semibold">ログイン後に参加できます</span>
      </div>
    </div>
  )
}

function SlotDate({ day, scheduledDate }: { day: number; scheduledDate: string | null }) {
  return (
    <span>
      <span class="block text-2xl font-light leading-none">{day}</span>
      <span class="mt-1 block text-xs text-(--color-muted)">{scheduledDate}</span>
    </span>
  )
}

function SlotsSection({ currentUser, isOwner, slots }: { currentUser: AuthenticatedUser | null; isOwner: boolean; slots: Slot[] }) {
  return (
    <section class="grid gap-6">
      <SectionNumber number="03 /" label="Slots" />
      <div class="border-b border-(--color-border)">
        {slots.map((slot) => <SlotRow currentUser={currentUser} isOwner={isOwner} slot={slot} />)}
      </div>
    </section>
  )
}

function SlotRow({ currentUser, isOwner, slot }: { currentUser: AuthenticatedUser | null; isOwner: boolean; slot: Slot }) {
  const isCurrentUserSlot = currentUser?.id === slot.userId

  return (
    <article class="grid gap-3 border-t border-(--color-border) py-4 sm:grid-cols-[7rem_1fr_auto] sm:items-start">
      <div>
        <p class="text-sm font-semibold">{slot.scheduledDate ?? `#${slot.position}`}</p>
      </div>
      <div>
        {slot.userId ? <AssignedSlot slot={slot} isCurrentUserSlot={isCurrentUserSlot} /> : <EmptySlot />}
      </div>
      <SlotActions currentUser={currentUser} isCurrentUserSlot={isCurrentUserSlot} isOwner={isOwner} slot={slot} />
    </article>
  )
}

function AssignedSlot({ isCurrentUserSlot, slot }: { isCurrentUserSlot: boolean; slot: Slot }) {
  return (
    <>
      <SlotUser slot={slot} />
      {slot.articleUrl ? (
        <a class="mt-1 block text-(--color-accent) underline-offset-4 hover:text-(--color-accent-hover) hover:underline" href={slot.articleUrl} rel="noopener noreferrer" target="_blank">
          {slot.articleTitle}
        </a>
      ) : (
        <p class="mt-1 text-(--color-muted)">記事準備中...</p>
      )}
      {isCurrentUserSlot ? (
        <a class="mt-3 inline-block text-sm font-semibold text-(--color-muted) underline-offset-4 hover:text-(--color-accent) hover:underline" href="/me">自分の予定で編集</a>
      ) : null}
    </>
  )
}

function SlotUser({ compact = false, slot }: { compact?: boolean; slot: Slot }) {
  const displayName = slot.displayName ?? slot.username ?? 'user'

  return (
    <div class="flex items-center gap-2">
      {slot.avatarUrl ? (
        <img class={`${compact ? 'h-7 w-7' : 'h-7 w-7'} rounded-full border border-(--color-border-strong) object-cover`} src={slot.avatarUrl} alt={displayName} />
      ) : (
        <span class="grid h-7 w-7 place-items-center rounded-full border border-(--color-border-strong) text-xs font-semibold text-(--color-muted)">{displayName.slice(0, 1)}</span>
      )}
      {compact ? <span class="min-w-0 truncate text-sm font-semibold">{displayName}</span> : <p class="font-semibold">{displayName}</p>}
    </div>
  )
}

function EmptySlot() {
  return (
    <>
      <p class="font-semibold text-(--color-muted)">空き枠</p>
      <p class="mt-1 text-sm text-(--color-muted)">この日の担当者を募集中です。</p>
    </>
  )
}

function SlotActions({ currentUser, isCurrentUserSlot, isOwner, slot }: { currentUser: AuthenticatedUser | null; isCurrentUserSlot: boolean; isOwner: boolean; slot: Slot }) {
  if (slot.userId) {
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

  if (currentUser) {
    return (
      <div>
        <form method="post" action={`/api/slots/${slot.id}/join`}>
          <button class="border border-(--color-accent) px-4 py-2 text-sm font-semibold text-(--color-accent) hover:bg-[#fff3ed]" type="submit">この日に参加する</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <button class="border border-(--color-border-strong) px-4 py-2 text-sm font-semibold text-(--color-muted)" type="button" disabled>ログイン後に参加</button>
    </div>
  )
}

function SectionNumber({ label, large = false, number }: { label: string; large?: boolean; number: string }) {
  return (
    <div class="flex items-baseline">
      <span class={`${large ? 'text-6xl' : 'text-5xl'} font-light leading-none text-(--color-accent)`}>{number}</span>
      <span class="mt-2 text-sm italic text-(--color-muted)">{label}</span>
    </div>
  )
}

function TagList({ tags }: { tags: Array<{ name: string }> }) {
  if (tags.length < 1) {
    return null
  }

  return (
    <div class="mt-5 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span class="border border-(--color-border) px-2 py-1 text-xs text-(--color-muted)">#{tag.name}</span>
      ))}
    </div>
  )
}

function getUtcDate(date: string) {
  return new Date(`${date}T00:00:00.000Z`).getUTCDate()
}

function getUtcWeekday(date: string) {
  return new Date(`${date}T00:00:00.000Z`).getUTCDay()
}

function translateActionError(message: string) {
  if (message === 'Authentication required') {
    return 'ログイン後に操作してください。'
  }

  if (message === 'Slot is not assigned to current user') {
    return 'この枠は現在のログインユーザーではキャンセルできません。ページを再読み込みしてログイン状態を確認してください。'
  }

  if (message === 'Slot is already taken') {
    return 'この枠はすでに参加済みです。ページを再読み込みしてください。'
  }

  if (message === 'Slot is already empty') {
    return 'この枠はすでに空き枠です。ページを再読み込みしてください。'
  }

  if (message === 'Slot not found') {
    return '対象の枠が見つかりませんでした。'
  }

  if (message.startsWith('Only the assigned user')) {
    return '記事を編集できるのは、この枠の担当者だけです。'
  }

  if (message.startsWith('Only the owner')) {
    return 'この操作ができるのはリレーの作成者だけです。'
  }

  if (message === 'Title is required') {
    return 'タイトルを入力してください。'
  }

  if (message.startsWith('Tag must be')) {
    return 'タグは1つ24文字以内で入力してください。'
  }

  return '操作に失敗しました。ページを再読み込みしてもう一度試してください。'
}
