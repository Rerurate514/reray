import type { Context } from 'hono'
import { getCookie } from 'hono/cookie'
import { syncAuthenticatedUser } from '../../application/user/syncAuthenticatedUser'
import { createDb } from '../providers/db/client'
import { createDrizzleUserRepository } from '../user/repositories/drizzleUserRepository'
import { verifyFirebaseIdToken } from './firebaseToken'

export async function getCurrentUser(c: Context) {
  const idToken = getCookie(c, 'reray_id_token')
  if (!idToken || !c.env.FIREBASE_PROJECT_ID || !c.env.DB) {
    return null
  }

  const claims = await verifyFirebaseIdToken(idToken, c.env.FIREBASE_PROJECT_ID)
  return syncAuthenticatedUser(createDrizzleUserRepository(createDb(c.env.DB)), claims)
}

export async function requireCurrentUser(c: Context) {
  const user = await getCurrentUser(c)
  if (!user) {
    throw new Error('Authentication required')
  }

  return user
}
