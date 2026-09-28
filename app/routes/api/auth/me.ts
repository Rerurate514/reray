import { createRoute } from "honox/factory";
import { getOptionalCurrentUser } from "../../../infrastructure/auth/currentUser";

export default createRoute(async (c) => {
  const user = await getOptionalCurrentUser(c);

  if (!user) {
    return c.json({ user: null });
  }

  return c.json({ user });
});
