import { createRoute } from 'honox/factory'
import { getPublicFirebaseConfig } from '../application/auth/firebaseConfig'
import { listPublicCalendars } from '../application/calendar/listPublicCalendars'
import { HomePage } from '../components/home/page'
import { createDrizzleCalendarRepository } from '../infrastructure/calendar/repositories/drizzleCalendarRepository'
import { createDb } from '../infrastructure/providers/db/client'

export default createRoute(async (c) => {
  const db = c.env.DB ? createDb(c.env.DB) : null
  const calendarRepository = db ? createDrizzleCalendarRepository(db) : null
  const calendars = calendarRepository ? await listPublicCalendars(calendarRepository) : []
  const firebaseConfig = getPublicFirebaseConfig(c.env)

  return c.render(<HomePage calendars={calendars} firebaseConfig={firebaseConfig} />)
})
