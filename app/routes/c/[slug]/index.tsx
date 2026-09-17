import { createRoute } from 'honox/factory'
import { getCalendarDetail } from '../../../application/calendar/getCalendarDetail'
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

  return c.render(
    <main class="mx-auto min-h-screen w-full max-w-5xl px-5 py-6 sm:px-8">
      <title>{calendar.title} - Reray</title>
      <header class="mb-10 flex items-center justify-between border-b border-(--color-border) pb-5">
        <a href="/" class="text-lg font-semibold tracking-tight">Reray</a>
        <a class="rounded-md border border-(--color-border) bg-(--color-surface) px-3 py-2 text-sm font-semibold hover:border-(--color-border-strong)" href="/new">作成</a>
      </header>

      <section class="mb-10 grid gap-5 border-b border-(--color-border) pb-10 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <p class="text-sm font-semibold text-(--color-accent)">@{calendar.owner.username}</p>
          <h1 class="mt-3 max-w-3xl text-4xl font-semibold leading-tight tracking-tight">{calendar.title}</h1>
          {calendar.description ? <p class="mt-5 max-w-2xl whitespace-pre-wrap leading-8 text-(--color-muted)">{calendar.description}</p> : null}
        </div>
        <p class="text-sm font-medium text-(--color-muted)">
          {calendar.startDate} - {calendar.endDate}
        </p>
      </section>

      <section class="overflow-hidden rounded-md border border-(--color-border) bg-(--color-surface)">
        {slots.map((slot) => (
          <article class="grid gap-3 border-b border-(--color-border) p-4 last:border-b-0 sm:grid-cols-[7rem_1fr_auto] sm:items-center">
            <div>
              <p class="text-sm font-semibold">{slot.scheduledDate ?? `#${slot.position}`}</p>
            </div>
            <div>
              {slot.userId ? (
                <>
                  <p class="font-semibold">{slot.displayName}</p>
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
              {slot.userId ? null : <button class="rounded-md border border-(--color-accent) px-4 py-2 text-sm font-semibold text-(--color-accent) hover:bg-[#fff3ed]">この日に参加する</button>}
            </div>
          </article>
        ))}
      </section>
    </main>,
  )
})
