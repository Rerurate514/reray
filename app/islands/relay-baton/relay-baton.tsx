import { useState } from "hono/jsx";
import type {
  RelayBaton as RelayBatonDto,
  RelayBatonLink,
} from "../../application/calendar/dtos/relayBaton";

type Props = {
  baton: RelayBatonDto;
  calendarSlug: string;
  calendarTitle: string;
};

export default function RelayBaton({
  baton,
  calendarSlug,
  calendarTitle,
}: Props) {
  const [notice, setNotice] = useState("");

  async function copyFooterText() {
    const text = createFooterText(calendarTitle, baton);

    if (!navigator.clipboard) {
      setNotice(
        "コピーできませんでした。表示された文を選択してコピーしてください。",
      );
      return;
    }

    await navigator.clipboard.writeText(text);
    setNotice("前後リンクの文案をコピーしました。");
    window.setTimeout(() => setNotice(""), 1800);
  }

  return (
    <section class="border border-(--color-border) p-5">
      <div class="flex flex-wrap items-end justify-between gap-3 border-b border-(--color-border) pb-4">
        <div>
          <p class="text-xs font-semibold uppercase text-(--color-accent)">
            Baton
          </p>
          <h2 class="mt-2 text-lg font-semibold">リレーのバトン</h2>
        </div>
        <button
          class="border border-(--color-border-strong) px-4 py-2 text-sm font-semibold hover:border-(--color-accent) hover:text-(--color-accent)"
          type="button"
          onClick={copyFooterText}
        >
          前後リンクの文案をコピー
        </button>
      </div>
      <p class="mt-4 max-w-2xl text-sm leading-6 text-(--color-muted)">
        前の記事を読んでから書くと、リレーがつながります。記事の末尾に貼れる前後リンクの文案もここからコピーできます。
      </p>
      <div class="mt-5 grid gap-4 md:grid-cols-2">
        <BatonLinkCard
          calendarSlug={calendarSlug}
          direction="previous"
          link={baton.previous}
        />
        <BatonLinkCard
          calendarSlug={calendarSlug}
          direction="next"
          link={baton.next}
        />
      </div>
      {notice ? (
        <p class="mt-4 text-xs font-semibold text-(--color-muted)">{notice}</p>
      ) : null}
    </section>
  );
}

function BatonLinkCard({
  calendarSlug,
  direction,
  link,
}: {
  calendarSlug: string;
  direction: "previous" | "next";
  link: RelayBatonLink | null;
}) {
  const heading = direction === "previous" ? "前の記事" : "次の記事";

  return (
    <div class="min-w-0 border border-(--color-border) p-4">
      <p class="text-xs font-semibold uppercase text-(--color-subtle)">
        {heading}
      </p>
      {link ? (
        <div class="mt-3 grid min-w-0 gap-1">
          <p class="text-xs text-(--color-muted)">
            {formatSlotLabel(link)} / {formatAuthor(link)}
          </p>
          <a
            class="break-words font-semibold text-(--color-accent) underline-offset-4 hover:text-(--color-accent-hover) hover:underline"
            href={link.articleUrl ?? "#"}
            rel="noopener noreferrer"
            target="_blank"
          >
            {formatArticleTitle(link)}
          </a>
          <a
            class="mt-1 w-fit text-xs font-semibold text-(--color-muted) underline-offset-4 hover:text-(--color-accent) hover:underline"
            href={`/c/${calendarSlug}/slots/${link.slotId}`}
          >
            枠ページを見る
          </a>
        </div>
      ) : (
        <p class="mt-3 text-sm text-(--color-muted)">
          {direction === "previous"
            ? "この枠より前の記事はまだ登録されていません。"
            : "この枠より後の記事はまだ登録されていません。"}
        </p>
      )}
    </div>
  );
}

function createFooterText(calendarTitle: string, baton: RelayBatonDto) {
  const lines = [`「${calendarTitle}」のリレー記事です。`];

  if (baton.previous?.articleUrl) {
    lines.push(`前の記事：${formatArticleTitle(baton.previous)}`);
    lines.push(baton.previous.articleUrl);
  }

  if (baton.next?.articleUrl) {
    lines.push(`次の記事：${formatArticleTitle(baton.next)}`);
    lines.push(baton.next.articleUrl);
  }

  return lines.join("\n");
}

function formatSlotLabel(link: RelayBatonLink) {
  return link.scheduledDate ?? `#${link.position}`;
}

function formatArticleTitle(link: RelayBatonLink) {
  return link.articleTitle ?? link.articleUrl ?? "記事";
}

function formatAuthor(link: RelayBatonLink) {
  return link.author?.displayName ?? link.author?.username ?? "匿名";
}
