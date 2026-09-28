import { deleteCookie, setCookie } from "hono/cookie";
import { createRoute } from "honox/factory";
import { getFirebaseProjectId } from "../../../application/auth/firebaseConfig";
import { verifyFirebaseIdToken } from "../../../infrastructure/auth/firebaseToken";

export const POST = createRoute(async (c) => {
  const { idToken } = await c.req.json<{ idToken?: string }>();
  const projectId = getFirebaseProjectId(c.env);

  if (!idToken || !projectId) {
    return c.json({ error: "authentication_required" }, 401);
  }

  try {
    await verifyFirebaseIdToken(idToken, projectId);
  } catch (error) {
    console.error(error);
    return c.json({ error: "authentication_required" }, 401);
  }

  setCookie(c, "reray_id_token", idToken, {
    httpOnly: true,
    sameSite: "Lax",
    secure: new URL(c.req.url).protocol === "https:",
    path: "/",
    maxAge: 60 * 60,
  });

  return c.json({ ok: true });
});

export const DELETE = createRoute((c) => {
  deleteCookie(c, "reray_id_token", {
    path: "/",
  });

  return c.json({ ok: true });
});
