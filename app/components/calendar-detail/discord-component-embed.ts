import type { Calendar } from './types'
import {
  createDateRangeText,
  createTagText,
  escapeDiscordMarkdown,
  type NextOpenSlotText,
  trimUtf8,
} from './preview-text'

export function createDiscordComponentEmbed({
  calendar,
  imageUrl,
  nextOpenSlotText,
  url,
}: {
  calendar: Calendar
  imageUrl: string
  nextOpenSlotText: NextOpenSlotText
  url: string
}) {
  const summaryItems = [
    `**${nextOpenSlotText.label}**\n${nextOpenSlotText.value}`,
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
