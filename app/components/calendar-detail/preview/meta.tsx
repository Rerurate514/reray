import { createDiscordComponentEmbed } from './discord-component-embed'
import {
  createCalendarPreviewDescription,
  createNextOpenSlotText,
} from './text'
import type { Calendar, Slot } from '../types/index'

const ogImage = {
  path: '/og-image.png',
  width: 1200,
  height: 630,
  alt: 'Reray Article Relay Calendar',
}

export function createCalendarPreviewMeta(calendar: Calendar, slots: Slot[], requestUrl: string) {
  const calendarUrl = new URL(`/c/${calendar.slug}`, requestUrl).toString()
  const imageUrl = new URL(ogImage.path, requestUrl).toString()
  const description = createCalendarPreviewDescription(calendar)
  const nextOpenSlotText = createNextOpenSlotText(slots)
  const title = `${calendar.title} - Reray`

  return {
    title,
    description,
    url: calendarUrl,
    image: {
      url: imageUrl,
      width: ogImage.width,
      height: ogImage.height,
      alt: ogImage.alt,
    },
    discordComponentEmbed: createDiscordComponentEmbed({
      calendar,
      imageUrl,
      nextOpenSlotText,
      url: calendarUrl,
    }),
  }
}
