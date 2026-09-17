import type { UserRepository } from './repositories/userRepository'
import { createId } from '../../domain/shared/services/createId'
import { createUsername } from '../../domain/user/services/createUsername'

export type FirebaseUserClaims = {
  uid: string
  name?: string
  picture?: string
  email?: string
}

export async function syncAuthenticatedUser(userRepository: UserRepository, claims: FirebaseUserClaims) {
  const existing = await userRepository.findByFirebaseUid(claims.uid)
  if (existing) {
    return existing
  }

  const now = Date.now()
  const displayName = claims.name?.trim() || claims.email?.split('@')[0] || 'Reray User'
  const username = await createUniqueUsername(userRepository, createUsername(claims.email?.split('@')[0] || displayName))

  return userRepository.create({
    id: createId('user'),
    firebaseUid: claims.uid,
    username,
    displayName,
    avatarUrl: claims.picture || null,
    bio: null,
    createdAt: now,
    updatedAt: now,
  })
}

async function createUniqueUsername(userRepository: UserRepository, baseUsername: string) {
  const existing = await userRepository.findUsername(baseUsername)
  if (!existing) {
    return baseUsername
  }

  for (let suffix = 2; suffix < 1000; suffix += 1) {
    const candidate = `${baseUsername}_${suffix}`
    const found = await userRepository.findUsername(candidate)
    if (!found) {
      return candidate
    }
  }

  return `${baseUsername}_${Date.now().toString(36)}`
}
