import type { UserRepository } from './repositories/userRepository'

export async function deleteAccount(userRepository: UserRepository, input: { userId: string }) {
  const deleted = await userRepository.delete(input.userId)
  if (!deleted) {
    throw new Error('Account not found')
  }
}
