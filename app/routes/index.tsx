import { createRoute } from 'honox/factory'
import { listPublicCalendars } from '../application/calendar/listPublicCalendars'
import { createDrizzleCalendarRepository } from '../infrastructure/calendar/repositories/drizzleCalendarRepository'
import { createDb } from '../infrastructure/providers/db/client'

export default createRoute(async (c) => {
  const db = c.env.DB ? createDb(c.env.DB) : null
  const calendarRepository = db ? createDrizzleCalendarRepository(db) : null
  const calendars = calendarRepository ? await listPublicCalendars(calendarRepository) : []

  return c.render(
    <main class="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6 sm:px-8">
      <title>Reray</title>
      <header class="flex items-center justify-between gap-4 border-b border-[var(--color-border)] pb-5">
        <a href="/" class="text-lg font-semibold tracking-tight">Reray</a>
        <nav class="flex items-center gap-1 text-sm">
          <a class="rounded-md px-3 py-2 text-[var(--color-muted)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)]" href="/me">自分の予定</a>
          <a class="rounded-md bg-[var(--color-text)] px-4 py-2 font-semibold text-white hover:bg-black" href="/new">リレーを作る</a>
        </nav>
      </header>

      <section class="grid gap-10 border-b border-[var(--color-border)] py-16 sm:grid-cols-[1.2fr_0.8fr] sm:items-end">
        <div>
          <p class="text-sm font-semibold text-[var(--color-accent)]">いつでも作れる記事リレー</p>
          <h1 class="mt-4 max-w-2xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl">
            テーマを決めて、枠を配って、記事をつなぐ。
          </h1>
        </div>
        <p class="max-w-xl text-base leading-8 text-[var(--color-muted)]">
          Reray は Zenn、Qiita、note、個人ブログなどの外部記事 URL を集めるための進行管理サービスです。
          カレンダーを作成して共有すれば、参加者は空き枠を選んで記事を登録できます。
        </p>
      </section>

      <section class="py-12">
        <div class="flex items-center justify-between gap-4">
          <h2 class="text-2xl font-semibold tracking-tight">開催中のリレー</h2>
          <a class="text-sm font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]" href="/new">新規作成</a>
        </div>
        {calendars.length > 0 ? (
          <div class="mt-5 grid gap-3 sm:grid-cols-2">
            {calendars.map((calendar) => (
              <a class="block rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition hover:border-[var(--color-border-strong)] hover:bg-[#fffdf9]" href={`/c/${calendar.slug}`}>
                <p class="text-sm text-[var(--color-subtle)]">@{calendar.owner.username}</p>
                <h3 class="mt-2 text-xl font-semibold tracking-tight">{calendar.title}</h3>
                <p class="mt-4 border-t border-[var(--color-border)] pt-3 text-sm text-[var(--color-muted)]">
                  {calendar.startDate} - {calendar.endDate}
                </p>
              </a>
            ))}
          </div>
        ) : (
          <div class="mt-5 rounded-md border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface)] p-6 text-[var(--color-muted)]">
            まだ公開中のリレーはありません。最初のリレーを作成できます。
          </div>
        )}
      </section>
    </main>,
  )
})
