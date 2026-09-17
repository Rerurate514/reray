import { createRoute } from 'honox/factory'
import { getCurrentUser } from '../../../infrastructure/auth/currentUser'

export default createRoute(async (c) => {
  try {
    const user = await getCurrentUser(c)

    if (!user) {
      return c.json({ user: null })
    }

    return c.json({ user })
  } catch {
    return c.json({ user: null })
  }
})
