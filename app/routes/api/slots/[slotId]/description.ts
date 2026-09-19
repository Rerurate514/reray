import { createRoute } from 'honox/factory'
import { updateSlotDescription } from '../../../../application/calendar/updateSlotDescription'
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
    await updateSlotDescription(createDrizzleCalendarRepository(createDb(c.env.DB)), {
      slotId,
      userId: user.id,
      description: String(body.description ?? ''),
    })

    const url = new URL(c.req.header('referer') ?? '/my-schedule', c.req.url)
    url.searchParams.set('description_saved', '1')
    return Response.redirect(url.toString(), 303)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to save slot notice'
    return redirectBackWithError(c.req.url, c.req.header('referer'), 'description_error', message)
  }
})
