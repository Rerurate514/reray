import { createRoute } from "honox/factory";
import { updateCalendar } from "../../../../application/calendar/updateCalendar";
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
    const calendarId = c.req.param("calendarId");
    if (!calendarId) {
      return c.json({ error: "calendar_not_found" }, 404);
    }

    const user = await requireCurrentUser(c);
    const body = await c.req.parseBody();
    await updateCalendar(createDrizzleCalendarRepository(createDb(c.env.DB)), {
      calendarId,
      userId: user.id,
      title: String(body.title ?? ""),
      description: String(body.description ?? ""),
      visibility: String(body.visibility ?? ""),
      capacity: String(body.capacity ?? ""),
      tags: String(body.tags ?? ""),
    });

    const url = new URL(c.req.header("referer") ?? "/", c.req.url);
    url.searchParams.set("calendar_saved", "1");
    url.searchParams.delete("calendar_error");
    return c.redirect(url.toString(), 303);
  } catch (error) {
    const { message } = presentError(error, "Calendar update failed");
    return redirectBackWithError(
      c.req.url,
      c.req.header("referer"),
      "calendar_error",
      message,
    );
  }
});
