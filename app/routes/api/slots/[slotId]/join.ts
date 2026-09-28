import { createRoute } from "honox/factory";
import { joinSlot } from "../../../../application/calendar/joinSlot";
import { requireCurrentUser } from "../../../../infrastructure/auth/currentUser";
import { createDrizzleCalendarRepository } from "../../../../infrastructure/calendar/repositories/drizzleCalendarRepository";
import { presentError } from "../../../../infrastructure/http/presentError";
import { redirectBackWithError } from "../../../../infrastructure/http/redirectBackWithError";
import { createDb } from "../../../../infrastructure/providers/db/client";

export const POST = createRoute(async (c) => {
  if (!c.env.DB) {
    return c.json({ error: "database_not_configured" }, 500);
  }

  try {
    const slotId = c.req.param("slotId");
    if (!slotId) {
      return c.json({ error: "slot_not_found" }, 404);
    }

    const user = await requireCurrentUser(c);
    await joinSlot(createDrizzleCalendarRepository(createDb(c.env.DB)), {
      slotId,
      userId: user.id,
    });

    if (wantsJson(c.req.header("accept"))) {
      return c.json({ ok: true });
    }

    return c.redirect(c.req.header("referer") ?? "/my-schedule");
  } catch (error) {
    const { status, message } = presentError(error, "Failed to join slot");
    if (wantsJson(c.req.header("accept"))) {
      return c.json({ error: message }, status);
    }

    return redirectBackWithError(
      c.req.url,
      c.req.header("referer"),
      "slot_error",
      message,
    );
  }
});

function wantsJson(acceptHeader: string | undefined) {
  return acceptHeader?.includes("application/json") ?? false;
}
