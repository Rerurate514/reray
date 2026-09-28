import { UserFacingError } from "../../domain/shared/errors/userFacingError";
import { normalizeDisplayName } from "../../domain/user/services/normalizeDisplayName";
import { normalizeProfileBio } from "../../domain/user/services/normalizeProfileBio";
import type { UserRepository } from "./repositories/userRepository";

export async function updateProfile(
  userRepository: UserRepository,
  input: { userId: string; displayName: string; bio: string | undefined },
) {
  const user = await userRepository.updateProfile({
    userId: input.userId,
    displayName: normalizeDisplayName(input.displayName),
    bio: normalizeProfileBio(input.bio),
    updatedAt: Date.now(),
  });

  if (!user) {
    throw new UserFacingError("notFound", "Account not found");
  }

  return user;
}
