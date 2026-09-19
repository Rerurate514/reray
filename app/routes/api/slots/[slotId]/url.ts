import { createRoute } from 'honox/factory'
import { updateSlotUrl } from '../../../../application/calendar/updateSlotUrl'
import { requireCurrentUser } from '../../../../infrastructure/auth/currentUser'
import { createDrizzleCalendarRepository } from '../../../../infrastructure/calendar/repositories/drizzleCalendarRepository'
import { redirectBackWithError } from '../../../../infrastructure/http/redirectBackWithError'
import { createDb } from '../../../../infrastructure/providers/db/client'

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
    await updateSlotUrl(createDrizzleCalendarRepository(createDb(c.env.DB)), {
      slotId,
      userId: user.id,
      url: String(body.url ?? ''),
    })

    const url = new URL(c.req.header('referer') ?? '/me', c.req.url)
    url.searchParams.set('url_saved', '1')
    return Response.redirect(url.toString(), 303)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to save slot URL'
    return redirectBackWithError(c.req.url, c.req.header('referer'), 'url_error', message)
  }
})
