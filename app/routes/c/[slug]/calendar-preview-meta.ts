import type { CalendarDetail } from '../../../application/calendar/dtos/calendarDetail'

const ogImage = {
  path: '/og-image.png',
  width: 1200,
  height: 630,
  alt: 'Reray Article Relay Calendar',
}

type CalendarForPreview = CalendarDetail['calendar']

export function createCalendarPreviewMeta(calendar: CalendarForPreview, requestUrl: string) {
  const calendarUrl = new URL(`/c/${calendar.slug}`, requestUrl).toString()
  const imageUrl = new URL(ogImage.path, requestUrl).toString()
  const description = createCalendarPreviewDescription(calendar)
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
      description,
      imageUrl,
      url: calendarUrl,
    }),
  }
}

function createCalendarPreviewDescription(calendar: CalendarForPreview) {
  const parts = [
    calendar.description?.trim(),
    createDateRangeText(calendar),
    calendar.tags.length > 0 ? calendar.tags.map((tag) => `#${tag.name}`).join(' ') : null,
  ].filter(Boolean)

  return trimUtf8(parts.join('\n'), 340)
}

function createDateRangeText(calendar: CalendarForPreview) {
  if (calendar.startDate && calendar.endDate) {
    return `${calendar.startDate} - ${calendar.endDate}`
  }

  return calendar.startDate ?? calendar.endDate ?? null
}

function createDiscordComponentEmbed({
  calendar,
  description,
  imageUrl,
  url,
}: {
  calendar: CalendarForPreview
  description: string
  imageUrl: string
  url: string
}) {
  const ownerText = `by ${calendar.owner.displayName}`
  const content = [`# **[${escapeDiscordMarkdown(calendar.title)}](${url})**`, description, ownerText]
    .filter(Boolean)
    .join('\n')

  const payload = {
    component: {
      type: 17,
      accent_color: 2105373,
      components: [
        {
          type: 9,
          components: [{ type: 10, content: trimUtf8(content, 900) }],
          accessory: {
            type: 2,
            style: 5,
            url,
            label: 'カレンダーを見る',
          },
        },
        {
          type: 12,
          items: [{ media: { url: imageUrl } }],
        },
      ],
    },
  }

  return JSON.stringify(payload)
    .replace(/<\//g, '<\\/')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

function trimUtf8(value: string, maxBytes: number) {
  const encoder = new TextEncoder()

  if (encoder.encode(value).length <= maxBytes) {
    return value
  }

  let result = ''

  for (const char of value) {
    const next = `${result}${char}`
    if (encoder.encode(`${next}…`).length > maxBytes) {
      return `${result}…`
    }
    result = next
  }

  return result
}

function escapeDiscordMarkdown(value: string) {
  return value.replace(/([\\`*_{}[\]()#+\-.!|>])/g, '\\$1')
}
