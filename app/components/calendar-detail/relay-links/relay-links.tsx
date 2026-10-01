import type {
  RelayBaton,
  RelayBatonLink,
} from "../../../application/calendar/dtos/relayBaton";

export function RelayLinks({
  calendarSlug,
  relay,
}: {
  calendarSlug: string;
  relay: RelayBaton;
}) {
  if (!relay.previous && !relay.next) {
    return null;
  }

  return (
    <div class="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-(--color-border) py-2 text-xs">
      {relay.previous ? (
        <a
          class="min-w-0 font-semibold text-(--color-muted) underline-offset-4 hover:text-(--color-accent) hover:underline"
          href={`/c/${calendarSlug}/slots/${relay.previous.slotId}`}
        >
          ← 前の記事: {formatArticleTitle(relay.previous)}
        </a>
      ) : null}
      {relay.next ? (
        <a
          class="min-w-0 font-semibold text-(--color-muted) underline-offset-4 hover:text-(--color-accent) hover:underline"
          href={`/c/${calendarSlug}/slots/${relay.next.slotId}`}
        >
          次の記事: {formatArticleTitle(relay.next)} →
        </a>
      ) : null}
    </div>
  );
}

function formatArticleTitle(link: RelayBatonLink) {
  return link.articleTitle ?? link.articleUrl ?? "記事";
}
