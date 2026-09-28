import { UserFacingError } from "../../shared/errors/userFacingError";

const maxDisplayNameLength = 40;

export function normalizeDisplayName(displayName: string) {
  const normalized = displayName.trim().replace(/\s+/g, " ");
  if (normalized.length < 1) {
    throw new UserFacingError("validation", "Display name is required");
  }

  if (normalized.length > maxDisplayNameLength) {
    throw new UserFacingError(
      "validation",
      `Display name must be ${maxDisplayNameLength} characters or fewer`,
    );
  }

  return normalized;
}
