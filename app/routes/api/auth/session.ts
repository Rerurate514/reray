import { deleteCookie, setCookie } from 'hono/cookie'
import { createRoute } from 'honox/factory'
import { verifyFirebaseIdToken } from '../../../infrastructure/auth/firebaseToken'

export const POST = createRoute(async (c) => {
  const { idToken } = await c.req.json<{ idToken?: string }>()

  if (!idToken || !c.env.FIREBASE_PROJECT_ID) {
    return c.json({ error: 'authentication_required' }, 401)
  }

  await verifyFirebaseIdToken(idToken, c.env.FIREBASE_PROJECT_ID)

  setCookie(c, 'reray_id_token', idToken, {
    httpOnly: true,
    sameSite: 'Lax',
    secure: new URL(c.req.url).protocol === 'https:',
    path: '/',
    maxAge: 60 * 60,
  })

  return c.json({ ok: true })
})

export const DELETE = createRoute((c) => {
  deleteCookie(c, 'reray_id_token', {
    path: '/',
  })

  return c.json({ ok: true })
})
