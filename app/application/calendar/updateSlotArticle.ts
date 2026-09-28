import { fetchArticleTitle } from "../../domain/article/services/fetchArticleTitle";
import { normalizeArticleTitle } from "../../domain/article/services/normalizeArticleTitle";
import { normalizeArticleUrl } from "../../domain/article/services/normalizeArticleUrl";
import { UserFacingError } from "../../domain/shared/errors/userFacingError";
import type { CalendarRepository } from "./repositories/calendarRepository";

export async function updateSlotArticle(
  calendarRepository: CalendarRepository,
  input: { slotId: string; userId: string; title: string; url: string },
) {
  const entry = await calendarRepository.findEntryByUser({
    slotId: input.slotId,
    userId: input.userId,
  });
  if (!entry) {
    throw new UserFacingError(
      "validation",
      "Join the slot before registering an article",
    );
  }

  const url = normalizeArticleUrl(input.url);
  const duplicateEntryId = await calendarRepository.findArticleEntryIdByUrl({
    calendarId: entry.calendarId,
    url,
  });
  if (duplicateEntryId && duplicateEntryId !== entry.id) {
    throw new UserFacingError("conflict", "Article URL is already registered");
  }

  const fetchedTitle = input.title.trim()
    ? null
    : await fetchArticleTitle(url).catch(() => null);
  const title = normalizeArticleTitle(
    input.title.trim() || fetchedTitle || createFallbackArticleTitle(url),
  );

  await calendarRepository.updateSlotArticle({
    entryId: entry.id,
    title,
    url,
    now: Date.now(),
  });
}

function createFallbackArticleTitle(url: string) {
  const parsed = new URL(url);
  return (
    parsed.hostname.replace(/^www\./, "") + parsed.pathname.replace(/\/$/, "")
  );
}
