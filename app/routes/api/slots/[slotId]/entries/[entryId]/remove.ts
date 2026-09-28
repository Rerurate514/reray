import { createRoute } from 'honox/factory'
import { removeSlotEntry } from '../../../../../../application/calendar/removeSlotEntry'
import { requireCurrentUser } from '../../../../../../infrastructure/auth/currentUser'
import { createDrizzleCalendarRepository } from '../../../../../../infrastructure/calendar/repositories/drizzleCalendarRepository'
import { createDb } from '../../../../../../infrastructure/providers/db/client'
import { presentError } from '../../../../../../infrastructure/http/presentError'
import { redirectBackWithError } from '../../../../../../infrastructure/http/redirectBackWithError'

export const POST = createRoute(async (c) => {
  if (!c.env.DB) {
    return c.json({ error: 'database_not_configured' }, 500)
  }

  try {
    const entryId = c.req.param('entryId')
    if (!entryId) {
      return c.json({ error: 'entry_not_found' }, 404)
    }

    const user = await requireCurrentUser(c)
    await removeSlotEntry(createDrizzleCalendarRepository(createDb(c.env.DB)), {
      entryId,
      userId: user.id,
    })

    return c.redirect(c.req.header('referer') ?? '/')
  } catch (error) {
    const { message } = presentError(error, 'Failed to remove participant')
    return redirectBackWithError(c.req.url, c.req.header('referer'), 'slot_error', message)
  }
})
