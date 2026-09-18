import { createRoute } from 'honox/factory'
import { getPublicFirebaseConfig } from '../../../application/auth/firebaseConfig'
import { getCalendarDetail } from '../../../application/calendar/getCalendarDetail'
import { CalendarDetailPage } from '../../../components/calendar-detail/page'
import { getCurrentUser } from '../../../infrastructure/auth/currentUser'
import { createDrizzleCalendarRepository } from '../../../infrastructure/calendar/repositories/drizzleCalendarRepository'
import { createDb } from '../../../infrastructure/providers/db/client'
import { createCalendarPreviewMeta } from './calendar-preview-meta'

export default createRoute(async (c) => {
  const slug = c.req.param('slug')

  if (!slug) {
    c.status(404)
    return c.render('Calendar not found')
  }

  if (!c.env.DB) {
    c.status(500)
    return c.render('D1 database binding is not configured')
  }

  const detail = await getCalendarDetail(createDrizzleCalendarRepository(createDb(c.env.DB)), slug)

  if (!detail) {
    c.status(404)
    return c.render('Calendar not found')
  }

  const { calendar, slots } = detail
  const firebaseConfig = getPublicFirebaseConfig(c.env)
  const currentUser = await getCurrentUser(c).catch(() => null)
  const slotError = c.req.query('slot_error')
  const articleError = c.req.query('article_error')
  const calendarError = c.req.query('calendar_error')
  const calendarSaved = c.req.query('calendar_saved')

  return c.render(
    <CalendarDetailPage
      calendar={calendar}
      calendarError={calendarError}
      calendarSaved={calendarSaved}
      currentUser={currentUser}
      firebaseConfig={firebaseConfig}
      slots={slots}
      slotError={slotError ?? articleError}
    />,
    createCalendarPreviewMeta(calendar, slots, c.req.url),
  )
})
