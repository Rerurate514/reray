import type { SlotDetailView } from "../../../application/calendar/dtos/slotDetail";
import {
  createDiscordField,
  type DiscordComponent,
  discordActionRow,
  discordContainer,
  discordLinkButton,
  discordMediaGallery,
  discordSection,
  discordTextDisplay,
  escapeDiscordMarkdown,
  serializeDiscordComponentEmbed,
  trimUtf8,
} from "../../shared/preview/index";
import {
  createSlotLabel,
  createSlotParticipantsText,
  createSlotStatusText,
  findSlotArticle,
} from "./text";

export function createSlotDiscordComponentEmbed({
  detail,
  imageUrl,
  requestUrl,
}: {
  detail: SlotDetailView;
  imageUrl: string;
  requestUrl: string;
}) {
  const { calendar, relay, slot } = detail;
  const slotUrl = new URL(
    `/c/${calendar.slug}/slots/${slot.id}`,
    requestUrl,
  ).toString();
  const calendarUrl = new URL(`/c/${calendar.slug}`, requestUrl).toString();
  const label = createSlotLabel(slot);
  const article = findSlotArticle(slot.participants);
  const participantsText = createSlotParticipantsText(slot.participants);

  const relayItems = [
    relay.previous?.articleUrl
      ? `前: [${escapeDiscordMarkdown(
          relay.previous.articleTitle ?? relay.previous.articleUrl,
        )}](${relay.previous.articleUrl})`
      : "前: なし",
    relay.next?.articleUrl
      ? `次: [${escapeDiscordMarkdown(
          relay.next.articleTitle ?? relay.next.articleUrl,
        )}](${relay.next.articleUrl})`
      : "次: なし",
  ].join("\n");

  const summaryItems = [
    createDiscordField("状態", createSlotStatusText(detail)),
    participantsText ? createDiscordField("担当", participantsText) : null,
    article?.articleUrl
      ? createDiscordField(
          "記事",
          `[${escapeDiscordMarkdown(
            article.articleTitle ?? article.articleUrl,
          )}](${article.articleUrl})`,
        )
      : null,
    createDiscordField("リレー", relayItems),
  ].filter((item): item is string => item !== null);

  const buttons = [
    discordLinkButton({ label: "カレンダーを見る", url: calendarUrl }),
    article?.articleUrl
      ? discordLinkButton({ label: "記事を読む", url: article.articleUrl })
      : null,
    relay.previous?.articleUrl
      ? discordLinkButton({ label: "前の記事", url: relay.previous.articleUrl })
      : null,
    relay.next?.articleUrl
      ? discordLinkButton({ label: "次の記事", url: relay.next.articleUrl })
      : null,
  ]
    .filter((button): button is DiscordComponent => button !== null)
    .slice(0, 4);

  const components = [
    discordSection({
      content: `# [${escapeDiscordMarkdown(
        calendar.title,
      )} の ${escapeDiscordMarkdown(label)}](${slotUrl})`,
      accessory: discordLinkButton({ label: "枠ページを見る", url: slotUrl }),
    }),
    discordTextDisplay(trimUtf8(summaryItems.join("\n\n"), 650)),
    buttons.length > 0 ? discordActionRow(buttons) : null,
    discordMediaGallery(imageUrl),
  ].filter((component): component is DiscordComponent => component !== null);

  return serializeDiscordComponentEmbed(
    discordContainer({ accentColor: 0x20201d, components }),
  );
}
