import { createRoute } from 'honox/factory'
import { getPublicFirebaseConfig } from '../application/auth/firebaseConfig'
import { listMyCalendars } from '../application/calendar/listMyCalendars'
import { listMySlots } from '../application/calendar/listMySlots'
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
    <main class="mx-auto min-h-screen w-full max-w-5xl px-5 py-6 sm:px-8">
      <title>自分の予定 - Reray</title>
      <header class="mb-12 flex flex-col gap-4 border-b border-(--color-text) pb-5 sm:flex-row sm:items-center sm:justify-between">
        <a href="/" class="reray-wordmark text-xl font-semibold tracking-tight">Reray</a>
        <AuthStatus config={firebaseConfig} />
      </header>
      {slotError || articleError || profileError ? (
        <div class="mb-8 border border-(--color-red) px-4 py-3 text-sm font-semibold text-(--color-red)">
          {translateActionError(slotError ?? articleError ?? profileError ?? '')}
        </div>
      ) : null}
      {profileSaved ? (
        <div class="mb-8 border border-(--color-green) px-4 py-3 text-sm font-semibold text-(--color-green)">
          表示名を保存しました。
        </div>
      ) : null}
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
              <form method="post" action="/api/account/profile" class="mt-8 grid gap-3 border-y border-(--color-border) py-6 sm:grid-cols-[1fr_auto] sm:items-end">
                <label class="grid gap-2">
                  <span class="text-sm font-semibold">表示名</span>
                  <input class="reray-input px-3 py-3" name="displayName" value={user.displayName} maxlength={40} required />
                </label>
                <button class="bg-(--color-text) px-4 py-3 text-sm font-semibold text-(--color-page) hover:bg-(--color-accent-hover)" type="submit">保存</button>
              </form>
              <section class="mt-8">
                <div class="flex items-center justify-between gap-4 border-b border-(--color-border) pb-3">
                  <h2 class="text-lg font-semibold tracking-tight">作成したリレー</h2>
                  <a class="text-sm font-semibold text-(--color-accent) hover:text-(--color-accent-hover)" href="/new">新規作成</a>
                </div>
                {myCalendars.length > 0 ? (
                  <div class="mt-4 grid gap-4 sm:grid-cols-2">
                    {myCalendars.map((calendar) => (
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
                    ))}
                  </div>
                ) : (
                  <p class="mt-5 max-w-2xl leading-8 text-(--color-muted)">まだ作成したリレーはありません。</p>
                )}
              </section>
              <section class="mt-10">
                <div class="border-b border-(--color-border) pb-3">
                  <h2 class="text-lg font-semibold tracking-tight">参加している枠</h2>
                </div>
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
                <p class="mt-5 max-w-2xl leading-8 text-(--color-muted)">まだ担当している枠はありません。公開リレーや共有された限定リレーの空き枠から参加できます。</p>
              )}
              </section>
              <DeleteAccount config={firebaseConfig} />
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
