import type { CalendarRepository } from './repositories/calendarRepository'
import { fetchArticleTitle } from '../../domain/article/services/fetchArticleTitle'
import { normalizeArticleTitle } from '../../domain/article/services/normalizeArticleTitle'
import { normalizeArticleUrl } from '../../domain/article/services/normalizeArticleUrl'
import { createId } from '../../domain/shared/services/createId'

export async function upsertSlotArticle(
  calendarRepository: CalendarRepository,
  input: { slotId: string; userId: string; title: string; url: string },
) {
  const ownerId = await calendarRepository.findSlotOwner(input.slotId)
  if (ownerId !== input.userId) {
    throw new Error('Only the assigned user can edit this article')
  }

  const url = normalizeArticleUrl(input.url)
  const duplicateSlotId = await calendarRepository.findArticleSlotIdByUrl(url)
  if (duplicateSlotId && duplicateSlotId !== input.slotId) {
    throw new Error('Article URL is already registered')
  }

  const fetchedTitle = input.title.trim() ? null : await fetchArticleTitle(url).catch(() => null)
  const title = normalizeArticleTitle(input.title.trim() || fetchedTitle || createFallbackArticleTitle(url))

  await calendarRepository.upsertArticle({
    id: createId('article'),
    slotId: input.slotId,
    title,
    url,
    now: Date.now(),
  })
}

function createFallbackArticleTitle(url: string) {
  const parsed = new URL(url)
  return parsed.hostname.replace(/^www\./, '') + parsed.pathname.replace(/\/$/, '')
}
