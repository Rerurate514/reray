import type { UserId } from '../valueObjects/userId'

export type AuthenticatedUser = {
  id: UserId
  firebaseUid: string
  username: string
  displayName: string
  avatarUrl: string | null
}

export type NewUser = {
  id: UserId
  firebaseUid: string
  username: string
  displayName: string
  avatarUrl: string | null
  bio: string | null
  createdAt: number
  updatedAt: number
}
