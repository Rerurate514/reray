import { normalizeDisplayName } from '../../domain/user/services/normalizeDisplayName'
import type { UserRepository } from './repositories/userRepository'

export async function updateProfile(userRepository: UserRepository, input: { userId: string; displayName: string }) {
  const user = await userRepository.updateProfile({
    userId: input.userId,
    displayName: normalizeDisplayName(input.displayName),
    updatedAt: Date.now(),
  })

  if (!user) {
    throw new Error('Account not found')
  }

  return user
}
