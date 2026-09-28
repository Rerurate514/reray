import type { SlotParticipant } from "../types/index";

export function SlotArticle({
  compact = false,
  participant,
}: {
  compact?: boolean;
  participant: SlotParticipant;
}) {
  if (!participant.articleUrl) {
    return compact ? null : (
      <p class="text-sm text-(--color-muted)">記事準備中...</p>
    );
  }

  if (compact) {
    return (
      <a
        class="line-clamp-2 text-xs font-semibold text-(--color-accent) underline-offset-4 hover:text-(--color-accent-hover) hover:underline"
        href={participant.articleUrl}
        rel="noopener noreferrer"
        target="_blank"
      >
        {participant.articleTitle}
      </a>
    );
  }

  return (
    <div class="min-w-0 border border-(--color-border) bg-[#fff8ed] p-3">
      <p class="text-xs font-semibold uppercase text-(--color-subtle)">
        Article
      </p>
      <a
        class="mt-1 block truncate font-semibold text-(--color-accent) underline-offset-4 hover:text-(--color-accent-hover) hover:underline"
        href={participant.articleUrl}
        rel="noopener noreferrer"
        target="_blank"
      >
        {participant.articleTitle}
      </a>
      <p class="mt-1 max-w-full truncate text-xs text-(--color-muted)">
        {participant.articleUrl}
      </p>
    </div>
  );
}
