import { UserFacingError } from "../../shared/errors/userFacingError";

export function normalizeArticleUrl(url: string) {
  const normalized = url.trim();

  let parsed: URL;
  try {
    parsed = new URL(normalized);
  } catch {
    throw new UserFacingError(
      "validation",
      "Article URL must be a valid http or https URL",
    );
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new UserFacingError(
      "validation",
      "Article URL must start with http or https",
    );
  }

  return parsed.toString();
}
