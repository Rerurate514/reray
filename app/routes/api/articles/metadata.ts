import { createRoute } from "honox/factory";
import { fetchArticleTitle } from "../../../domain/article/services/fetchArticleTitle";
import { normalizeArticleUrl } from "../../../domain/article/services/normalizeArticleUrl";
import { requireCurrentUser } from "../../../infrastructure/auth/currentUser";

export const GET = createRoute(async (c) => {
  const user = await requireCurrentUser(c);
  const limiter = c.env.ARTICLE_METADATA_RATE_LIMITER;

  if (limiter) {
    const { success } = await limiter.limit({ key: user.id });

    if (!success) {
      return c.json({ error: "rate_limited" }, 429);
    }
  }

  try {
    const url = normalizeArticleUrl(c.req.query("url") ?? "");
    const title = await fetchArticleTitle(url).catch(() => null);

    return c.json({ title });
  } catch {
    return c.json({ title: null }, 400);
  }
});
