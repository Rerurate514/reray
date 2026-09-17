import { createRoute } from 'honox/factory'
import { joinSlot } from '../../../../application/calendar/joinSlot'
import { requireCurrentUser } from '../../../../infrastructure/auth/currentUser'
import { createDrizzleCalendarRepository } from '../../../../infrastructure/calendar/repositories/drizzleCalendarRepository'
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
    await joinSlot(createDrizzleCalendarRepository(createDb(c.env.DB)), {
      slotId,
      userId: user.id,
    })

    return c.redirect(c.req.header('referer') ?? '/me')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to join slot'
    return c.json({ error: message }, message === 'Slot is already taken' ? 409 : 401)
  }
})
