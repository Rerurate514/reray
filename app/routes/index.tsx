import { createRoute } from 'honox/factory'
import { getPublicFirebaseConfig } from '../application/auth/firebaseConfig'
import { listPublicCalendars } from '../application/calendar/listPublicCalendars'
import { HomePage } from '../components/home/page'
import { createDrizzleCalendarRepository } from '../infrastructure/calendar/repositories/drizzleCalendarRepository'
import { createDb } from '../infrastructure/providers/db/client'

export default createRoute(async (c) => {
  const db = c.env.DB ? createDb(c.env.DB) : null
  const calendarRepository = db ? createDrizzleCalendarRepository(db) : null
  const result = calendarRepository
    ? await listPublicCalendars(calendarRepository, {
        query: c.req.query('q'),
        tag: c.req.query('tag'),
        status: c.req.query('status'),
      })
    : { calendars: [], search: { query: '', tag: '', status: 'all' as const } }
  const firebaseConfig = getPublicFirebaseConfig(c.env)

  return c.render(<HomePage calendars={result.calendars} firebaseConfig={firebaseConfig} search={result.search} />)
})
