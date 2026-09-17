import { createRoute } from 'honox/factory'
import { getPublicFirebaseConfig } from '../application/auth/firebaseConfig'
import { createCalendar } from '../application/calendar/createCalendar'
import AuthStatus from '../islands/auth-status'
import { requireCurrentUser } from '../infrastructure/auth/currentUser'
import { createDrizzleCalendarRepository } from '../infrastructure/calendar/repositories/drizzleCalendarRepository'
import { createDb } from '../infrastructure/providers/db/client'

export const POST = createRoute(async (c) => {
  if (!c.env.DB) {
    return c.json({ error: 'database_not_configured' }, 500)
  }

  try {
    const user = await requireCurrentUser(c)
    const body = await c.req.parseBody()
    const result = await createCalendar(createDrizzleCalendarRepository(createDb(c.env.DB)), {
      ownerId: user.id,
      title: String(body.title ?? ''),
      description: String(body.description ?? ''),
      startDate: String(body.startDate ?? ''),
      endDate: String(body.endDate ?? ''),
      frequency: body.frequency === 'weekdays' ? 'weekdays' : 'daily',
    })

    return c.redirect(`/c/${result.slug}`)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Calendar creation failed'
    return c.json({ error: message }, message === 'Authentication required' ? 401 : 400)
  }
})

export default createRoute((c) => {
  const firebaseConfig = getPublicFirebaseConfig(c.env)

  return c.render(
    <main class="mx-auto min-h-screen w-full max-w-5xl px-5 py-6 sm:px-8">
      <title>リレー作成 - Reray</title>
      <header class="mb-12 flex items-center justify-between border-b border-(--color-text) pb-5">
        <a href="/" class="reray-wordmark text-xl font-semibold tracking-tight">Reray</a>
        <AuthStatus config={firebaseConfig} />
      </header>

      <section class="grid gap-10 sm:grid-cols-[12rem_1fr">
        <div class="flex items-baseline">
          <span class="text-6xl font-light leading-none text-(--color-accent)">01 /</span>
          <span class="mt-2 text-sm italic text-(--color-muted)">Create Relay</span>
        </div>

        <form method="post" class="grid gap-6 border-t border-(--color-border) pt-6">
          <div>
            <div class="bg-(--color-text) px-4 py-3 text-xl font-semibold tracking-tight text-(--color-page)">記事リレーを作成</div>
            <p class="mt-5 max-w-xl text-sm leading-7 text-(--color-muted)">テーマと期間を決めると、投稿枠を自動生成します。</p>
            <div class="reray-rule mt-6" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
          </div>

          <label class="grid gap-2">
            <span class="text-sm font-semibold">タイトル</span>
            <input class="reray-input px-3 py-3" name="title" required maxlength={120} placeholder="Flutter を30日間語る" />
          </label>

          <label class="grid gap-2">
            <span class="text-sm font-semibold">説明</span>
            <textarea class="reray-input min-h-28 px-3 py-3 leading-7" name="description" placeholder="テーマや参加条件を書いてください" />
          </label>

          <div class="grid gap-4 sm:grid-cols-2">
            <label class="grid gap-2">
              <span class="text-sm font-semibold">開始日</span>
              <input class="reray-input px-3 py-3" type="date" name="startDate" required />
            </label>
            <label class="grid gap-2">
              <span class="text-sm font-semibold">終了日</span>
              <input class="reray-input px-3 py-3" type="date" name="endDate" required />
            </label>
          </div>

          <fieldset class="grid gap-3 border-t border-(--color-border) pt-5">
            <legend class="text-sm font-semibold">枠の生成</legend>
            <label class="flex items-center gap-3 text-sm">
              <input class="accent-(--color-accent)" type="radio" name="frequency" value="daily" checked />
              <span>毎日</span>
            </label>
            <label class="flex items-center gap-3 text-sm">
              <input class="accent-(--color-accent)" type="radio" name="frequency" value="weekdays" />
              <span>平日のみ</span>
            </label>
          </fieldset>

          <button class="bg-(--color-text) px-5 py-3 font-semibold text-(--color-page) hover:bg-(--color-accent-hover)" type="submit">作成する</button>
        </form>
      </section>
    </main>,
  )
})
