import { createRoute } from 'honox/factory'
import { getPublicFirebaseConfig } from '../application/auth/firebaseConfig'
import { listMyCalendars } from '../application/calendar/listMyCalendars'
import { listMySlots } from '../application/calendar/listMySlots'
import { MyPage } from '../components/my/page'
import { getCurrentUser } from '../infrastructure/auth/currentUser'
import { createDrizzleCalendarRepository } from '../infrastructure/calendar/repositories/drizzleCalendarRepository'
import { createDb } from '../infrastructure/providers/db/client'

export default createRoute(async (c) => {
  const firebaseConfig = getPublicFirebaseConfig(c.env)
  const user = await getCurrentUser(c).catch(() => null)
  const calendarRepository = c.env.DB ? createDrizzleCalendarRepository(createDb(c.env.DB)) : null
  const mySlots = user && calendarRepository ? await listMySlots(calendarRepository, user.id) : []
  const myCalendars = user && calendarRepository ? await listMyCalendars(calendarRepository, user.id) : []
  const slotError = c.req.query('slot_error')
  const articleError = c.req.query('article_error')
  const profileError = c.req.query('profile_error')
  const profileSaved = c.req.query('profile_saved')

  return c.render(
    <MyPage
      articleError={articleError}
      firebaseConfig={firebaseConfig}
      myCalendars={myCalendars}
      mySlots={mySlots}
      profileError={profileError}
      profileSaved={profileSaved}
      slotError={slotError}
      user={user}
    />,
  )
})
