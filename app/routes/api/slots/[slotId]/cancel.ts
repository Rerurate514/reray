import { createRoute } from 'honox/factory'
import { cancelSlot } from '../../../../application/calendar/cancelSlot'
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
    await cancelSlot(createDrizzleCalendarRepository(createDb(c.env.DB)), {
      slotId,
      userId: user.id,
    })

    return c.redirect(c.req.header('referer') ?? '/my-schedule')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to cancel slot'
    return redirectBackWithError(c.req.url, c.req.header('referer'), 'slot_error', message)
  }
})
