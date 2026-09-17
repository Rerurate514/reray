import { createRoute } from 'honox/factory'
import { upsertSlotArticle } from '../../../../application/calendar/upsertSlotArticle'
import { requireCurrentUser } from '../../../../infrastructure/auth/currentUser'
import { createDrizzleCalendarRepository } from '../../../../infrastructure/calendar/repositories/drizzleCalendarRepository'
import { createDb } from '../../../../infrastructure/providers/db/client'
import { redirectBackWithError } from '../../../../infrastructure/http/redirectBackWithError'

export const POST = createRoute(async (c) => {
  if (!c.env.DB) {
    return c.json({ error: 'database_not_configured' }, 500)
  }

  try {
    const slotId = c.req.param('slotId')
    if (!slotId) {
      return c.json({ error: 'slot_not_found' }, 404)
    }

    const user = await requireCurrentUser(c)
    const body = await c.req.parseBody()
    await upsertSlotArticle(createDrizzleCalendarRepository(createDb(c.env.DB)), {
      slotId,
      userId: user.id,
      title: String(body.title ?? ''),
      url: String(body.url ?? ''),
    })

    return c.redirect(c.req.header('referer') ?? '/me')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to save article'
    return redirectBackWithError(c.req.url, c.req.header('referer'), 'article_error', message)
  }
})
