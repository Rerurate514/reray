import { UserFacingError } from "../../domain/shared/errors/userFacingError";

const accountsDeleteUrl =
  "https://identitytoolkit.googleapis.com/v1/accounts:delete";

export async function deleteFirebaseAccount(apiKey: string, idToken: string) {
  const response = await fetch(
    `${accountsDeleteUrl}?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    },
  );

  if (response.ok) {
    return;
  }

  const body = (await response.json().catch(() => null)) as {
    error?: { message?: string };
  } | null;
  console.error(
    "Failed to delete Firebase account",
    body?.error?.message ?? response.status,
  );

  throw new UserFacingError(
    "authenticationRequired",
    "Please sign in again before deleting your account",
  );
}
