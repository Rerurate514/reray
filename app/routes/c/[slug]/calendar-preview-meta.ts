import type { CalendarDetail } from '../../../application/calendar/dtos/calendarDetail'

const ogImage = {
  path: '/og-image.png',
  width: 1200,
  height: 630,
  alt: 'Reray Article Relay Calendar',
}

type CalendarForPreview = CalendarDetail['calendar']
type SlotForPreview = CalendarDetail['slots'][number]

export function createCalendarPreviewMeta(calendar: CalendarForPreview, slots: SlotForPreview[], requestUrl: string) {
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
  imageUrl,
  nextOpenSlotText,
  url,
}: {
  calendar: CalendarForPreview
  imageUrl: string
  nextOpenSlotText: { label: string; value: string } | null
  url: string
}) {
  const summaryItems = [
    nextOpenSlotText ? `**${nextOpenSlotText.label}**\n${nextOpenSlotText.value}` : null,
    createDateRangeText(calendar) ? `**期間**\n${createDateRangeText(calendar)}` : null,
    `**作成者**\n${escapeDiscordMarkdown(calendar.owner.displayName)}`,
  ].filter(Boolean)
  const tagText = createTagText(calendar)
  const descriptionText = calendar.description?.trim()

  const components = [
    {
      type: 9,
      components: [{ type: 10, content: `# [${escapeDiscordMarkdown(calendar.title)}](${url})` }],
      accessory: {
        type: 2,
        style: 5,
        url,
        label: 'カレンダーを見る',
      },
    },
    { type: 10, content: trimUtf8(summaryItems.join('\n\n'), 650) },
    descriptionText ? { type: 14, spacing: 1 } : null,
    descriptionText ? { type: 10, content: trimUtf8(descriptionText, 260) } : null,
    tagText ? { type: 10, content: tagText } : null,
    {
      type: 12,
      items: [{ media: { url: imageUrl } }],
    },
  ].filter((component) => component !== null)

  const payload = {
    component: {
      type: 17,
      accent_color: 2105373,
      components,
    },
  }

  return JSON.stringify(payload)
    .replace(/<\//g, '<\\/')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

function createNextOpenSlotText(slots: SlotForPreview[]) {
  const openSlot = slots
    .filter((slot) => !slot.userId)
    .sort((a, b) => {
      if (a.scheduledDate && b.scheduledDate) {
        return a.scheduledDate.localeCompare(b.scheduledDate) || a.position - b.position
      }

      if (a.scheduledDate) {
        return -1
      }

      if (b.scheduledDate) {
        return 1
      }

      return a.position - b.position
    })[0]

  if (!openSlot) {
    return {
      label: '直近の空き枠',
      value: 'ありません',
    }
  }

  return {
    label: '直近の空き枠',
    value: openSlot.scheduledDate ?? `#${openSlot.position}`,
  }
}

function createTagText(calendar: CalendarForPreview) {
  if (calendar.tags.length === 0) {
    return null
  }

  return calendar.tags.map((tag) => `\`${escapeDiscordMarkdown(tag.name)}\``).join(' ')
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
