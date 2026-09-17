import { createRoute } from 'honox/factory'
import { createDb } from '../db/client'
import { listPublicCalendars } from '../application/calendar/useCases'

export default createRoute(async (c) => {
  const db = c.env.DB ? createDb(c.env.DB) : null
  const calendars = db ? await listPublicCalendars(db) : []

  return c.render(
    <main class="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-10 px-5 py-8 sm:px-8">
      <title>Reray</title>
      <header class="flex items-center justify-between gap-4">
        <a href="/" class="text-xl font-bold tracking-[0]">Reray</a>
        <nav class="flex items-center gap-2 text-sm">
          <a class="rounded-md px-3 py-2 hover:bg-white" href="/me">自分の予定</a>
          <a class="rounded-md bg-[#1f2933] px-4 py-2 font-semibold text-white" href="/new">リレーを作る</a>
        </nav>
      </header>

      <section class="grid gap-6 py-8 sm:grid-cols-[1.2fr_0.8fr] sm:items-end">
        <div>
          <p class="text-sm font-semibold text-[#b3532a]">いつでも作れる記事リレー</p>
          <h1 class="mt-3 max-w-2xl text-4xl font-bold leading-tight sm:text-6xl">
            テーマを決めて、枠を配って、記事をつなぐ。
          </h1>
        </div>
        <p class="text-base leading-8 text-[#55616d]">
          Reray は Zenn、Qiita、note、個人ブログなどの外部記事 URL を集めるための進行管理サービスです。
          カレンダーを作成して共有すれば、参加者は空き枠を選んで記事を登録できます。
        </p>
      </section>

      <section class="space-y-4">
        <div class="flex items-center justify-between gap-4">
          <h2 class="text-2xl font-bold">開催中のリレー</h2>
          <a class="text-sm font-semibold text-[#b3532a]" href="/new">新規作成</a>
        </div>
        {calendars.length > 0 ? (
          <div class="grid gap-3 sm:grid-cols-2">
            {calendars.map((calendar) => (
              <a class="rounded-lg border border-[#ded6ca] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md" href={`/c/${calendar.slug}`}>
                <p class="text-sm text-[#687583]">@{calendar.owner.username}</p>
                <h3 class="mt-2 text-xl font-bold">{calendar.title}</h3>
                <p class="mt-3 text-sm text-[#687583]">
                  {calendar.startDate} - {calendar.endDate}
                </p>
              </a>
            ))}
          </div>
        ) : (
          <div class="rounded-lg border border-dashed border-[#cbbfaf] bg-white/70 p-6 text-[#687583]">
            まだ公開中のリレーはありません。最初のリレーを作成できます。
          </div>
        )}
      </section>
    </main>,
  )
})
