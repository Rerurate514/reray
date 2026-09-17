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
    <main class="mx-auto min-h-screen w-full max-w-4xl px-5 py-8 sm:px-8">
      <title>{calendar.title} - Reray</title>
      <header class="mb-8 flex items-center justify-between">
        <a href="/" class="text-xl font-bold">Reray</a>
        <a class="rounded-md bg-white px-3 py-2 text-sm font-semibold" href="/new">作成</a>
      </header>

      <section class="mb-8">
        <p class="text-sm font-semibold text-[#b3532a]">@{calendar.owner.username}</p>
        <h1 class="mt-2 text-4xl font-bold leading-tight">{calendar.title}</h1>
        {calendar.description ? <p class="mt-4 whitespace-pre-wrap leading-8 text-[#55616d]">{calendar.description}</p> : null}
        <p class="mt-4 text-sm text-[#687583]">
          {calendar.startDate} - {calendar.endDate}
        </p>
      </section>

      <section class="overflow-hidden rounded-lg border border-[#ded6ca] bg-white shadow-sm">
        {slots.map((slot) => (
          <article class="grid gap-3 border-b border-[#ece6dd] p-4 last:border-b-0 sm:grid-cols-[7rem_1fr_auto] sm:items-center">
            <div>
              <p class="font-semibold">{slot.scheduledDate ?? `#${slot.position}`}</p>
            </div>
            <div>
              {slot.userId ? (
                <>
                  <p class="font-semibold">{slot.displayName}</p>
                  {slot.articleUrl ? (
                    <a class="mt-1 block text-[#b3532a] underline-offset-4 hover:underline" href={slot.articleUrl} rel="noopener noreferrer" target="_blank">
                      {slot.articleTitle}
                    </a>
                  ) : (
                    <p class="mt-1 text-[#687583]">記事準備中...</p>
                  )}
                </>
              ) : (
                <>
                  <p class="font-semibold text-[#687583]">空き枠</p>
                  <p class="mt-1 text-sm text-[#687583]">この日の担当者を募集中です。</p>
                </>
              )}
            </div>
            <div>
              {slot.userId ? null : <button class="rounded-md border border-[#b3532a] px-4 py-2 text-sm font-semibold text-[#b3532a]">この日に参加する</button>}
            </div>
          </article>
        ))}
      </section>
    </main>,
  )
})
