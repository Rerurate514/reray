import { createRoute } from 'honox/factory'
import { deleteCalendar } from '../../../../application/calendar/deleteCalendar'
import { requireCurrentUser } from '../../../../infrastructure/auth/currentUser'
import { createDrizzleCalendarRepository } from '../../../../infrastructure/calendar/repositories/drizzleCalendarRepository'
import { createDb } from '../../../../infrastructure/providers/db/client'

export const POST = createRoute(async (c) => {
  if (!c.env.DB) {
    return c.json({ error: 'database_not_configured' }, 500)
  }

  try {
    const calendarId = c.req.param('calendarId')
    if (!calendarId) {
      return c.json({ error: 'calendar_not_found' }, 404)
    }

    const user = await requireCurrentUser(c)
    await deleteCalendar(createDrizzleCalendarRepository(createDb(c.env.DB)), {
      calendarId,
      userId: user.id,
    })

    return c.redirect('/')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete calendar'
    const status = message === 'Authentication required' ? 401 : message.startsWith('Only the owner') ? 403 : 404
    return c.json({ error: message }, status)
  }
})
