import type { UserRepository } from './repositories/userRepository'

export async function getUserByUsername(userRepository: UserRepository, username: string) {
  return userRepository.findByUsername(username)
}
