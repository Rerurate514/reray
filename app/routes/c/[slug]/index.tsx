import { createRoute } from 'honox/factory'
import { getPublicFirebaseConfig } from '../../../application/auth/firebaseConfig'
import { getCalendarDetail } from '../../../application/calendar/getCalendarDetail'
import AuthStatus from '../../../islands/auth-status'
import { createDrizzleCalendarRepository } from '../../../infrastructure/calendar/repositories/drizzleCalendarRepository'
import { createDb } from '../../../infrastructure/providers/db/client'

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
  const weekdayLabels = ['日', '月', '火', '水', '木', '金', '土']
  const firstScheduledDate = slots.find((slot) => slot.scheduledDate)?.scheduledDate
  const leadingBlankDays = firstScheduledDate ? getUtcWeekday(firstScheduledDate) : 0

  return c.render(
    <main class="mx-auto min-h-screen w-full max-w-6xl px-5 py-6 sm:px-8">
      <title>{calendar.title} - Reray</title>
      <header class="mb-12 flex items-center justify-between border-b border-(--color-text) pb-5">
        <a href="/" class="reray-wordmark text-xl font-semibold tracking-tight">Reray</a>
        <div class="flex items-center gap-2">
          <a class="border border-(--color-border-strong) px-3 py-2 text-sm font-semibold hover:border-(--color-accent) hover:text-(--color-accent)" href="/new">作成</a>
          <AuthStatus config={firebaseConfig} />
        </div>
      </header>

      <section class="mb-12 grid gap-10 sm:grid-cols-[10rem_1fr">
        <div>
          <p class="text-6xl font-light leading-none text-(--color-accent)">01 /</p>
          <div class="mt-2 flex items-center gap-2 text-sm italic text-(--color-muted)">
            {calendar.owner.avatarUrl ? (
              <img class="h-6 w-6 rounded-full border border-(--color-border-strong) object-cover" src={calendar.owner.avatarUrl} alt={calendar.owner.username} />
            ) : (
              <span class="grid h-6 w-6 place-items-center rounded-full border border-(--color-border-strong) text-xs not-italic">{calendar.owner.username.slice(0, 1)}</span>
            )}
            <span>@{calendar.owner.username}</span>
          </div>
        </div>
        <div class="border-t border-(--color-border) pt-6">
          <div class="bg-(--color-text) px-4 py-3 text-sm font-semibold text-(--color-page) sm:text-base">
            {calendar.startDate} - {calendar.endDate}
          </div>
          <h1 class="mt-8 max-w-4xl text-4xl font-medium leading-tight tracking-tight sm:text-6xl">{calendar.title}</h1>
          {calendar.description ? <p class="mt-6 max-w-2xl whitespace-pre-wrap leading-8 text-(--color-muted)">{calendar.description}</p> : null}
          <div class="reray-rule mt-8" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
        </div>
      </section>

      <section class="mb-12 grid gap-6 sm:grid-cols-[10rem_1fr">
        <div>
          <p class="text-5xl font-light leading-none">02 /</p>
          <p class="mt-2 text-sm italic text-(--color-muted)">Calendar</p>
        </div>
        <div>
          <div class="grid grid-cols-7 border-l border-t border-(--color-border)">
            {weekdayLabels.map((label) => (
              <div class="border-b border-r border-(--color-border) px-2 py-2 text-center text-xs font-semibold text-(--color-muted)">{label}</div>
            ))}
            {Array.from({ length: leadingBlankDays }).map(() => (
              <div class="min-h-28 border-b border-r border-(--color-border) bg-(--color-surface-muted) opacity-55" aria-hidden="true"></div>
            ))}
            {slots.map((slot) => {
              const day = slot.scheduledDate ? getUtcDate(slot.scheduledDate) : slot.position
              return (
                <div class="min-h-28 border-b border-r border-(--color-border) bg-(--color-surface) p-2">
                  {slot.userId ? (
                    <div class="flex h-full flex-col justify-between gap-3">
                      <div>
                        <p class="text-2xl font-light leading-none">{day}</p>
                        <p class="mt-1 text-xs text-(--color-muted)">{slot.scheduledDate}</p>
                      </div>
                      <div class="flex items-center gap-2">
                        {slot.avatarUrl ? (
                          <img class="h-7 w-7 rounded-full border border-(--color-border-strong) object-cover" src={slot.avatarUrl} alt={slot.displayName ?? slot.username ?? 'user'} />
                        ) : (
                          <span class="grid h-7 w-7 place-items-center rounded-full border border-(--color-border-strong) text-xs font-semibold text-(--color-muted)">{(slot.displayName ?? slot.username ?? '?').slice(0, 1)}</span>
                        )}
                        <span class="min-w-0 truncate text-sm font-semibold">{slot.displayName ?? slot.username}</span>
                      </div>
                    </div>
                  ) : (
                    <form method="post" action={`/api/slots/${slot.id}/join`} class="h-full">
                      <button class="flex h-full w-full flex-col justify-between gap-3 text-left hover:text-(--color-accent)" type="submit">
                        <span>
                          <span class="block text-2xl font-light leading-none">{day}</span>
                          <span class="mt-1 block text-xs text-(--color-muted)">{slot.scheduledDate}</span>
                        </span>
                        <span class="text-sm font-semibold text-(--color-accent)">参加する</span>
                      </button>
                    </form>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section class="grid gap-6 sm:grid-cols-[10rem_1fr">
        <div>
          <p class="text-5xl font-light leading-none">03 /</p>
          <p class="mt-2 text-sm italic text-(--color-muted)">Slots</p>
        </div>
        <div class="border-b border-(--color-border)">
        {slots.map((slot) => (
          <article class="grid gap-3 border-t border-(--color-border) py-4 sm:grid-cols-[7rem_1fr_auto sm:items-center">
            <div>
              <p class="text-sm font-semibold">{slot.scheduledDate ?? `#${slot.position}`}</p>
            </div>
            <div>
              {slot.userId ? (
                <>
                  <div class="flex items-center gap-2">
                    {slot.avatarUrl ? (
                      <img class="h-7 w-7 rounded-full border border-(--color-border-strong) object-cover" src={slot.avatarUrl} alt={slot.displayName ?? slot.username ?? 'user'} />
                    ) : (
                      <span class="grid h-7 w-7 place-items-center rounded-full border border-(--color-border-strong) text-xs font-semibold text-(--color-muted)">{(slot.displayName ?? slot.username ?? '?').slice(0, 1)}</span>
                    )}
                    <p class="font-semibold">{slot.displayName}</p>
                  </div>
                  {slot.articleUrl ? (
                    <a class="mt-1 block text-(--color-accent) underline-offset-4 hover:text-(--color-accent-hover) hover:underline" href={slot.articleUrl} rel="noopener noreferrer" target="_blank">
                      {slot.articleTitle}
                    </a>
                  ) : (
                    <p class="mt-1 text-(--color-muted)">記事準備中...</p>
                  )}
                </>
              ) : (
                <>
                  <p class="font-semibold text-(--color-muted)">空き枠</p>
                  <p class="mt-1 text-sm text-(--color-muted)">この日の担当者を募集中です。</p>
                </>
              )}
            </div>
            <div>
              {slot.userId ? null : (
                <form method="post" action={`/api/slots/${slot.id}/join`}>
                  <button class="border border-(--color-accent) px-4 py-2 text-sm font-semibold text-(--color-accent) hover:bg-[#fff3ed" type="submit">この日に参加する</button>
                </form>
              )}
            </div>
          </article>
        ))}
        </div>
      </section>
    </main>,
  )
})

function getUtcDate(date: string) {
  return new Date(`${date}T00:00:00.000Z`).getUTCDate()
}

function getUtcWeekday(date: string) {
  return new Date(`${date}T00:00:00.000Z`).getUTCDay()
}
