import { createRoute } from 'honox/factory'
import type { PublicFirebaseConfig } from '../application/auth/firebaseConfig'
import { getPublicFirebaseConfig } from '../application/auth/firebaseConfig'
import type { CalendarSummary } from '../application/calendar/dtos/calendarSummary'
import { listPublicCalendars } from '../application/calendar/listPublicCalendars'
import AuthStatus from '../islands/auth-status'
import { createDrizzleCalendarRepository } from '../infrastructure/calendar/repositories/drizzleCalendarRepository'
import { createDb } from '../infrastructure/providers/db/client'

export default createRoute(async (c) => {
  const db = c.env.DB ? createDb(c.env.DB) : null
  const calendarRepository = db ? createDrizzleCalendarRepository(db) : null
  const calendars = calendarRepository ? await listPublicCalendars(calendarRepository) : []
  const firebaseConfig = getPublicFirebaseConfig(c.env)

  return c.render(<HomePage calendars={calendars} firebaseConfig={firebaseConfig} />)
})

function HomePage({ calendars, firebaseConfig }: { calendars: CalendarSummary[]; firebaseConfig: PublicFirebaseConfig | null }) {
  return (
    <main class="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6 sm:px-8">
      <title>Reray</title>
      <HomeHeader firebaseConfig={firebaseConfig} />
      <HeroSection />
      <PublicCalendarsSection calendars={calendars} />
    </main>
  )
}

function HomeHeader({ firebaseConfig }: { firebaseConfig: PublicFirebaseConfig | null }) {
  return (
    <header class="flex flex-col gap-4 border-b border-(--color-text) pb-5 sm:flex-row sm:items-center sm:justify-between">
      <a href="/" class="reray-wordmark text-xl font-semibold tracking-tight">Reray</a>
      <nav class="flex flex-wrap items-center gap-2 text-sm">
        <a class="border border-(--color-border-strong) px-3 py-2 font-semibold text-(--color-muted) hover:border-(--color-accent) hover:text-(--color-accent)" href="/me">自分の予定</a>
        <a class="bg-(--color-text) px-4 py-2 font-semibold text-(--color-page) hover:bg-(--color-accent-hover)" href="/new">リレーを作る</a>
        <span class="mx-1 hidden h-6 border-l border-(--color-border) sm:inline-block"></span>
        <AuthStatus config={firebaseConfig} />
      </nav>
    </header>
  )
}

function HeroSection() {
  return (
    <section class="grid gap-10 py-12 sm:py-16">
      <SectionNumber number="01 /" label="Relay Boards" large />
      <div>
        <div class="bg-(--color-text) px-4 py-3 text-xl font-semibold tracking-tight text-(--color-page) sm:text-3xl">
          いつでも作れる記事リレー
        </div>
        <h1 class="mt-8 max-w-3xl text-4xl font-medium leading-[1.08] tracking-tight sm:text-6xl">
          テーマを決めて、枠を配って、記事をつなぐ。
        </h1>
        <p class="mt-8 max-w-2xl text-base leading-8 text-(--color-muted)">
          Reray は Zenn、Qiita、note、個人ブログなどの外部記事 URL を集めるための進行管理サービスです。
          カレンダーを作成して共有すれば、参加者は空き枠を選んで記事を登録できます。
        </p>
        <div class="reray-rule mt-10" aria-hidden="true"><span></span><span></span><span></span></div>
      </div>
    </section>
  )
}

function PublicCalendarsSection({ calendars }: { calendars: CalendarSummary[] }) {
  return (
    <section class="grid gap-8 border-t border-(--color-border) py-12">
      <SectionNumber number="02 /" label="Public" />
      <div>
        <div class="flex items-center justify-between gap-4 border-b border-(--color-border) pb-4">
          <h2 class="reray-accent-letter text-2xl font-semibold tracking-tight">開催中のリレー</h2>
          <a class="text-sm font-semibold text-(--color-accent) hover:text-(--color-accent-hover)" href="/new">新規作成</a>
        </div>
        {calendars.length > 0 ? (
          <div class="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {calendars.map((calendar) => <CalendarCard calendar={calendar} />)}
          </div>
        ) : (
          <div class="mt-5 border-y border-dashed border-(--color-border-strong) py-8 text-(--color-muted)">
            まだ公開中のリレーはありません。最初のリレーを作成できます。
          </div>
        )}
      </div>
    </section>
  )
}

function CalendarCard({ calendar }: { calendar: CalendarSummary }) {
  return (
    <a class="grid min-h-48 border border-(--color-border) p-4 transition hover:bg-(--color-surface-muted)" href={`/c/${calendar.slug}`}>
      <div class="flex items-center gap-2 text-sm text-(--color-subtle)">
        {calendar.owner.avatarUrl ? (
          <img class="h-6 w-6 rounded-full border border-(--color-border-strong) object-cover" src={calendar.owner.avatarUrl} alt={calendar.owner.displayName} />
        ) : (
          <span class="grid h-6 w-6 place-items-center rounded-full border border-(--color-border-strong) text-xs">{calendar.owner.displayName.slice(0, 1)}</span>
        )}
        <span>{calendar.owner.displayName}</span>
      </div>
      <h3 class="mt-4 text-xl font-semibold tracking-tight">{calendar.title}</h3>
      {calendar.tags.length > 0 ? (
        <div class="mt-4 flex flex-wrap gap-2">
          {calendar.tags.map((tag) => (
            <span class="border border-(--color-border) px-2 py-1 text-xs text-(--color-muted)">#{tag.name}</span>
          ))}
        </div>
      ) : null}
      <p class="mt-auto border-t border-(--color-border) pt-3 text-sm text-(--color-muted)">{calendar.startDate} - {calendar.endDate}</p>
    </a>
  )
}

function SectionNumber({ number, label, large = false }: { number: string; label: string; large?: boolean }) {
  return (
    <div class={`flex items-baseline ${large ? 'sm:pt-3' : ''}`}>
      <span class={`${large ? 'text-6xl sm:text-7xl' : 'text-5xl'} font-light leading-none text-(--color-accent)`}>{number}</span>
      <span class="mt-2 text-sm italic text-(--color-muted)">{label}</span>
    </div>
  )
}
