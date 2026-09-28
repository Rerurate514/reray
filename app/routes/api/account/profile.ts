import { createRoute } from "honox/factory";
import { updateProfile } from "../../../application/user/updateProfile";
import { requireCurrentUser } from "../../../infrastructure/auth/currentUser";
import { presentError } from "../../../infrastructure/http/presentError";
import { createDb } from "../../../infrastructure/providers/db/client";
import { createDrizzleUserRepository } from "../../../infrastructure/user/repositories/drizzleUserRepository";

export const POST = createRoute(async (c) => {
  if (!c.env.DB) {
    return c.json({ error: "database_not_configured" }, 500);
  }

  try {
    const user = await requireCurrentUser(c);
    const formData = await c.req.formData();
    const displayName = String(formData.get("displayName") ?? "");
    const bio = String(formData.get("bio") ?? "");
    await updateProfile(createDrizzleUserRepository(createDb(c.env.DB)), {
      userId: user.id,
      displayName,
      bio,
    });

    const url = new URL(
      c.req.header("referer") ?? `/u/${user.username}`,
      c.req.url,
    );
    url.searchParams.set("profile_saved", "1");
    return c.redirect(url.toString(), 303);
  } catch (error) {
    const { message } = presentError(error, "Failed to update profile");
    const url = new URL(c.req.header("referer") ?? "/my-schedule", c.req.url);
    url.searchParams.set("profile_error", message);
    return c.redirect(url.toString(), 303);
  }
});
