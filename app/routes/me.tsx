import { createRoute } from 'honox/factory'
import { getPublicFirebaseConfig } from '../application/auth/firebaseConfig'
import { listMySlots } from '../application/calendar/listMySlots'
import AuthStatus from '../islands/auth-status'
import { getCurrentUser } from '../infrastructure/auth/currentUser'
import { createDrizzleCalendarRepository } from '../infrastructure/calendar/repositories/drizzleCalendarRepository'
import { createDb } from '../infrastructure/providers/db/client'

export default createRoute(async (c) => {
  const firebaseConfig = getPublicFirebaseConfig(c.env)
  const user = await getCurrentUser(c).catch(() => null)
  const mySlots = user && c.env.DB ? await listMySlots(createDrizzleCalendarRepository(createDb(c.env.DB)), user.id) : []

  return c.render(
    <main class="mx-auto min-h-screen w-full max-w-5xl px-5 py-6 sm:px-8">
      <title>自分の予定 - Reray</title>
      <header class="mb-12 flex flex-col gap-4 border-b border-(--color-text) pb-5 sm:flex-row sm:items-center sm:justify-between">
        <a href="/" class="reray-wordmark text-xl font-semibold tracking-tight">Reray</a>
        <AuthStatus config={firebaseConfig} />
      </header>
      <section class="grid gap-10">
        <div class="flex items-baseline">
          <span class="text-6xl font-light leading-none text-(--color-accent)">01 /</span>
          <span class="mt-2 text-sm italic text-(--color-muted)">My Schedule</span>
        </div>
        <div class="border-t border-(--color-border) pt-6">
          <div class="bg-(--color-text) px-4 py-3 text-xl font-semibold tracking-tight text-(--color-page)">自分の予定</div>
          {user ? (
            <>
              <p class="mt-5 max-w-2xl leading-8 text-(--color-muted)">@{user.username} としてログインしています。</p>
              {mySlots.length > 0 ? (
                <div class="mt-8 border-b border-(--color-border)">
                  {mySlots.map((slot) => (
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
                  ))}
                </div>
              ) : (
                <p class="mt-5 max-w-2xl leading-8 text-(--color-muted)">まだ担当している枠はありません。公開リレーの空き枠から参加できます。</p>
              )}
            </>
          ) : (
            <p class="mt-5 max-w-2xl leading-8 text-(--color-muted)">Firebase 認証の接続後、自分が担当している枠をここに表示します。</p>
          )}
          <div class="reray-rule mt-8" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
        </div>
      </section>
    </main>,
  )
})
