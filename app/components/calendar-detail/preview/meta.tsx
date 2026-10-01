import { ogImage } from "../../shared/preview/index";
import type { Calendar, Slot } from "../types/index";
import { createDiscordComponentEmbed } from "./discord-component-embed";
import { createCalendarPreviewDescription } from "./text";

export function createCalendarPreviewMeta(
  calendar: Calendar,
  slots: Slot[],
  requestUrl: string,
) {
  const calendarUrl = new URL(`/c/${calendar.slug}`, requestUrl).toString();
  const imageUrl = new URL(ogImage.path, requestUrl).toString();

  return {
    title: `${calendar.title} - Reray`,
    description: createCalendarPreviewDescription(calendar),
    url: calendarUrl,
    noIndex: calendar.visibility === "private",
    image: {
      url: imageUrl,
      width: ogImage.width,
      height: ogImage.height,
      alt: ogImage.alt,
    },
    discordComponentEmbed: createDiscordComponentEmbed({
      calendar,
      imageUrl,
      requestUrl,
      slots,
    }),
  };
}
