import { eq } from 'drizzle-orm'
import type { UserRepository } from '../../../application/user/repositories/userRepository'
import type { AuthenticatedUser, NewUser } from '../../../domain/user/entities/user'
import type { Db } from '../../providers/db/client'
import { users } from '../../providers/db/schema'

export function createDrizzleUserRepository(db: Db): UserRepository {
  return {
    async findByFirebaseUid(firebaseUid) {
      const user = await db.query.users.findFirst({
        where: eq(users.firebaseUid, firebaseUid),
      })

      return user ? toAuthenticatedUser(user) : null
    },

    async findUsername(username) {
      const user = await db.query.users.findFirst({
        columns: {
          username: true,
        },
        where: eq(users.username, username),
      })

      return user?.username ?? null
    },

    async create(user) {
      await db.insert(users).values(user)
      return toAuthenticatedUser(user)
    },
  }
}

function toAuthenticatedUser(user: NewUser): AuthenticatedUser {
  return {
    id: user.id,
    firebaseUid: user.firebaseUid,
    username: user.username,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl,
  }
}
