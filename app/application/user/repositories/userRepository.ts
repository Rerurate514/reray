import type { AuthenticatedUser, NewUser } from '../../../domain/user/entities/user'

export type UserRepository = {
  findByFirebaseUid(firebaseUid: string): Promise<AuthenticatedUser | null>
  findUsername(username: string): Promise<string | null>
  create(user: NewUser): Promise<AuthenticatedUser>
}
