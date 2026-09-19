import { createRoute } from 'honox/factory'
import { getPublicFirebaseConfig } from '../../../application/auth/firebaseConfig'
import { listPublicProfileCalendars } from '../../../application/calendar/listPublicProfileCalendars'
import { listPublicProfileSlots } from '../../../application/calendar/listPublicProfileSlots'
import { getUserByUsername } from '../../../application/user/getUserByUsername'
import { AccountProfilePage } from '../../../components/account-profile/page'
import { getCurrentUser } from '../../../infrastructure/auth/currentUser'
import { createDrizzleCalendarRepository } from '../../../infrastructure/calendar/repositories/drizzleCalendarRepository'
import { createDb } from '../../../infrastructure/providers/db/client'
import { createDrizzleUserRepository } from '../../../infrastructure/user/repositories/drizzleUserRepository'

export default createRoute(async (c) => {
  const username = c.req.param('username')

  if (!username) {
    c.status(404)
    return c.render('Account not found')
  }

  if (!c.env.DB) {
    c.status(500)
    return c.render('D1 database binding is not configured')
  }

  const db = createDb(c.env.DB)
  const profileUser = await getUserByUsername(createDrizzleUserRepository(db), username)

  if (!profileUser) {
    c.status(404)
    return c.render('Account not found')
  }

  const calendarRepository = createDrizzleCalendarRepository(db)
  const currentUser = await getCurrentUser(c).catch(() => null)
  const [calendars, slots] = await Promise.all([
    listPublicProfileCalendars(calendarRepository, profileUser.id),
    listPublicProfileSlots(calendarRepository, profileUser.id),
  ])

  return c.render(
    <AccountProfilePage
      calendars={calendars}
      currentUser={currentUser}
      firebaseConfig={getPublicFirebaseConfig(c.env)}
      profileError={c.req.query('profile_error')}
      profileSaved={c.req.query('profile_saved')}
      profileUser={profileUser}
      slots={slots}
    />,
  )
})
