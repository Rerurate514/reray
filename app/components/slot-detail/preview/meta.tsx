import type { SlotDetailView } from "../../../application/calendar/dtos/slotDetail";
import { ogImage } from "../../shared/preview/index";
import { createSlotDiscordComponentEmbed } from "./discord-component-embed";
import { createSlotLabel, createSlotPreviewDescription } from "./text";

export function createSlotPreviewMeta(
  detail: SlotDetailView,
  requestUrl: string,
) {
  const slotUrl = new URL(
    `/c/${detail.calendar.slug}/slots/${detail.slot.id}`,
    requestUrl,
  ).toString();
  const imageUrl = new URL(ogImage.path, requestUrl).toString();

  return {
    title: `${detail.calendar.title} / ${createSlotLabel(detail.slot)} - Reray`,
    description: createSlotPreviewDescription(detail),
    url: slotUrl,
    noIndex: detail.calendar.visibility === "private",
    image: {
      url: imageUrl,
      width: ogImage.width,
      height: ogImage.height,
      alt: ogImage.alt,
    },
    discordComponentEmbed: createSlotDiscordComponentEmbed({
      detail,
      imageUrl,
      requestUrl,
    }),
  };
}
