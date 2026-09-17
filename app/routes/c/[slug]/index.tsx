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
    <main class="mx-auto min-h-screen w-full max-w-6xl px-5 py-6 sm:px-8">
      <title>{calendar.title} - Reray</title>
      <header class="mb-12 flex items-center justify-between border-b border-(--color-text) pb-5">
        <a href="/" class="reray-wordmark text-xl font-semibold tracking-tight">Reray</a>
        <a class="border border-(--color-border-strong) px-3 py-2 text-sm font-semibold hover:border-(--color-accent) hover:text-(--color-accent)" href="/new">作成</a>
      </header>

      <section class="mb-12 grid gap-10 sm:grid-cols-[10rem_1fr">
        <div>
          <p class="text-6xl font-light leading-none text-(--color-accent)">01 /</p>
          <p class="mt-2 text-sm italic text-(--color-muted)">@{calendar.owner.username}</p>
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

      <section class="grid gap-6 sm:grid-cols-[10rem_1fr">
        <div>
          <p class="text-5xl font-light leading-none">02 /</p>
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
              {slot.userId ? null : <button class="border border-(--color-accent) px-4 py-2 text-sm font-semibold text-(--color-accent) hover:bg-[#fff3ed">この日に参加する</button>}
            </div>
          </article>
        ))}
        </div>
      </section>
    </main>,
  )
})
