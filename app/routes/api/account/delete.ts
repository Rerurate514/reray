import { deleteCookie } from 'hono/cookie'
import { createRoute } from 'honox/factory'
import { deleteAccount } from '../../../application/user/deleteAccount'
import { requireCurrentUser } from '../../../infrastructure/auth/currentUser'
import { createDb } from '../../../infrastructure/providers/db/client'
import { createDrizzleUserRepository } from '../../../infrastructure/user/repositories/drizzleUserRepository'

export const POST = createRoute(async (c) => {
  if (!c.env.DB) {
    return c.json({ error: 'database_not_configured' }, 500)
  }

  try {
    const user = await requireCurrentUser(c)
    await deleteAccount(createDrizzleUserRepository(createDb(c.env.DB)), {
      userId: user.id,
    })

    deleteCookie(c, 'reray_id_token', {
      path: '/',
    })

    return c.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete account'
    const status = message === 'Authentication required' ? 401 : message === 'Account not found' ? 404 : 500
    return c.json({ error: message }, status)
  }
})
