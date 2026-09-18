import { createRoute } from 'honox/factory'
import { getPublicFirebaseConfig } from '../application/auth/firebaseConfig'
import { createCalendar } from '../application/calendar/createCalendar'
import { NewCalendarPage } from '../components/new-calendar/page'
import { requireCurrentUser } from '../infrastructure/auth/currentUser'
import { createDrizzleCalendarRepository } from '../infrastructure/calendar/repositories/drizzleCalendarRepository'
import { redirectBackWithError } from '../infrastructure/http/redirectBackWithError'
import { createDb } from '../infrastructure/providers/db/client'

export const POST = createRoute(async (c) => {
  if (!c.env.DB) {
    return c.json({ error: 'database_not_configured' }, 500)
  }

  try {
    const user = await requireCurrentUser(c)
    const body = await c.req.parseBody()
    const result = await createCalendar(createDrizzleCalendarRepository(createDb(c.env.DB)), {
      ownerId: user.id,
      title: String(body.title ?? ''),
      description: String(body.description ?? ''),
      startDate: String(body.startDate ?? ''),
      endDate: String(body.endDate ?? ''),
      frequency: body.frequency === 'weekdays' ? 'weekdays' : 'daily',
      visibility: String(body.visibility ?? ''),
      tags: String(body.tags ?? ''),
    })

    return c.redirect(`/c/${result.slug}`)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Calendar creation failed'
    return redirectBackWithError(c.req.url, c.req.header('referer'), 'create_error', message)
  }
})

export default createRoute((c) => {
  const firebaseConfig = getPublicFirebaseConfig(c.env)
  const createError = c.req.query('create_error')

  return c.render(<NewCalendarPage createError={createError} firebaseConfig={firebaseConfig} />)
})
