import {
  createDateRangeText,
  createDiscordField,
  type DiscordComponent,
  discordActionRow,
  discordContainer,
  discordLinkButton,
  discordMediaGallery,
  discordSection,
  discordSeparator,
  discordTextDisplay,
  escapeDiscordMarkdown,
  serializeDiscordComponentEmbed,
  trimUtf8,
} from "../../shared/preview/index";
import type { Calendar, Slot } from "../types/index";
import {
  createNextOpenSlotText,
  createRelayProgressText,
  createTagText,
  findFirstArticleSlot,
  findNextOpenSlot,
  type PreviewField,
} from "./text";

export function createDiscordComponentEmbed({
  calendar,
  imageUrl,
  requestUrl,
  slots,
}: {
  calendar: Calendar;
  imageUrl: string;
  requestUrl: string;
  slots: Slot[];
}) {
  const calendarUrl = new URL(`/c/${calendar.slug}`, requestUrl).toString();
  const nextOpenSlot = findNextOpenSlot(slots, calendar.capacity);
  const nextOpenSlotUrl = nextOpenSlot
    ? new URL(
        `/c/${calendar.slug}/slots/${nextOpenSlot.id}`,
        requestUrl,
      ).toString()
    : null;
  const firstArticleSlot = findFirstArticleSlot(slots);
  const firstArticleUrl = firstArticleSlot
    ? new URL(
        `/c/${calendar.slug}/slots/${firstArticleSlot.id}`,
        requestUrl,
      ).toString()
    : null;
  const ownerUrl = calendar.owner
    ? new URL(`/u/${calendar.owner.username}`, requestUrl).toString()
    : null;

  const dateRangeText = createDateRangeText(
    calendar.startDate,
    calendar.endDate,
  );
  const summaryItems = [
    createRelayProgressText(slots),
    createNextOpenSlotText(slots, calendar.capacity),
    dateRangeText ? { label: "期間", value: dateRangeText } : null,
    {
      label: "作成者",
      value: escapeDiscordMarkdown(calendar.owner?.displayName ?? "退会済み"),
    },
  ].filter((item): item is PreviewField => item !== null);

  const tagText = createTagText(calendar);
  const descriptionText = calendar.description?.trim();

  const buttons = [
    nextOpenSlotUrl
      ? discordLinkButton({ label: "直近の空き枠を見る", url: nextOpenSlotUrl })
      : null,
    firstArticleUrl
      ? discordLinkButton({ label: "最初の記事を読む", url: firstArticleUrl })
      : null,
    ownerUrl
      ? discordLinkButton({ label: "主催者を見る", url: ownerUrl })
      : null,
  ].filter((button): button is DiscordComponent => button !== null);

  const components = [
    discordSection({
      content: `# [${escapeDiscordMarkdown(calendar.title)}](${calendarUrl})`,
      accessory: discordLinkButton({
        label: "カレンダーを見る",
        url: calendarUrl,
      }),
    }),
    discordTextDisplay(
      trimUtf8(
        summaryItems
          .map((item) => createDiscordField(item.label, item.value))
          .join("\n\n"),
        650,
      ),
    ),
    buttons.length > 0 ? discordActionRow(buttons) : null,
    descriptionText ? discordSeparator(1) : null,
    descriptionText ? discordTextDisplay(trimUtf8(descriptionText, 260)) : null,
    tagText ? discordTextDisplay(tagText) : null,
    discordMediaGallery(imageUrl),
  ].filter((component): component is DiscordComponent => component !== null);

  return serializeDiscordComponentEmbed(
    discordContainer({ accentColor: 0x20201d, components }),
  );
}
