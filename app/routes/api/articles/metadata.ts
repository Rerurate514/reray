import { createRoute } from 'honox/factory'
import { fetchArticleTitle } from '../../../domain/article/services/fetchArticleTitle'
import { normalizeArticleUrl } from '../../../domain/article/services/normalizeArticleUrl'
import { requireCurrentUser } from '../../../infrastructure/auth/currentUser'

export const GET = createRoute(async (c) => {
  await requireCurrentUser(c)

  try {
    const url = normalizeArticleUrl(c.req.query('url') ?? '')
    const title = await fetchArticleTitle(url).catch(() => null)

    return c.json({ title })
  } catch {
    return c.json({ title: null }, 400)
  }
})
