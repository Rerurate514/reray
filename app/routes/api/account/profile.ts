import { createRoute } from 'honox/factory'
import { updateProfile } from '../../../application/user/updateProfile'
import { requireCurrentUser } from '../../../infrastructure/auth/currentUser'
import { createDb } from '../../../infrastructure/providers/db/client'
import { createDrizzleUserRepository } from '../../../infrastructure/user/repositories/drizzleUserRepository'

export const POST = createRoute(async (c) => {
  if (!c.env.DB) {
    return c.json({ error: 'database_not_configured' }, 500)
  }

  try {
    const user = await requireCurrentUser(c)
    const formData = await c.req.formData()
    const displayName = String(formData.get('displayName') ?? '')
    await updateProfile(createDrizzleUserRepository(createDb(c.env.DB)), {
      userId: user.id,
      displayName,
    })

    return c.redirect('/my-schedule?profile_saved=1')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update profile'
    const url = new URL('/my-schedule', c.req.url)
    url.searchParams.set('profile_error', message)
    return c.redirect(url.toString(), 303)
  }
})
