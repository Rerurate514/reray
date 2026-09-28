import { deleteCookie } from "hono/cookie";
import { createRoute } from "honox/factory";
import { deleteAccount } from "../../../application/user/deleteAccount";
import { UserFacingError } from "../../../domain/shared/errors/userFacingError";
import {
  getCurrentIdToken,
  requireCurrentUser,
} from "../../../infrastructure/auth/currentUser";
import { deleteFirebaseAccount } from "../../../infrastructure/auth/deleteFirebaseAccount";
import { presentError } from "../../../infrastructure/http/presentError";
import { createDb } from "../../../infrastructure/providers/db/client";
import { createDrizzleUserRepository } from "../../../infrastructure/user/repositories/drizzleUserRepository";

export const POST = createRoute(async (c) => {
  if (!c.env.DB) {
    return c.json({ error: "database_not_configured" }, 500);
  }

  try {
    const user = await requireCurrentUser(c);
    const idToken = getCurrentIdToken(c);
    const apiKey = c.env.PUBLIC_FIREBASE_API_KEY;

    if (!idToken || !apiKey) {
      throw new UserFacingError(
        "authenticationRequired",
        "Please sign in again before deleting your account",
      );
    }

    await deleteFirebaseAccount(apiKey, idToken);
    await deleteAccount(createDrizzleUserRepository(createDb(c.env.DB)), {
      userId: user.id,
    });

    deleteCookie(c, "reray_id_token", {
      path: "/",
    });

    return c.json({ ok: true });
  } catch (error) {
    const { status, message } = presentError(error, "Failed to delete account");
    return c.json({ error: message }, status);
  }
});
