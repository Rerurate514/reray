import { UserFacingError } from "../../shared/errors/userFacingError";

const maxBioLength = 200;

export function normalizeProfileBio(bio: string | undefined) {
  const normalized = (bio ?? "").trim();
  if (!normalized) {
    return null;
  }

  if (normalized.length > maxBioLength) {
    throw new UserFacingError(
      "validation",
      `Bio must be ${maxBioLength} characters or fewer`,
    );
  }

  return normalized;
}
