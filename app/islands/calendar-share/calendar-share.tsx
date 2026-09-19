import { useEffect, useState } from 'hono/jsx'

type Props = {
  calendar: {
    title: string
    startDate: string | null
    endDate: string | null
    tags: Array<{ name: string }>
    visibility: 'public' | 'private'
  }
}

export default function CalendarShare({ calendar }: Props) {
  const [url, setUrl] = useState('')
  const [notice, setNotice] = useState('共有リンクと募集文をここからコピーできます。')

  useEffect(() => {
    setUrl(window.location.href)
  }, [])

  async function copy(value: string, copiedMessage: string) {
    if (!value) {
      return
    }

    if (!navigator.clipboard) {
      setNotice('コピーできませんでした。表示された文を選択してコピーしてください。')
      return
    }

    await navigator.clipboard.writeText(value)
    setNotice(copiedMessage)
    window.setTimeout(() => setNotice('共有リンクと募集文をここからコピーできます。'), 1800)
  }

  const slackText = createSlackMessage(calendar, url)
  const discordText = createDiscordMessage(calendar, url)
  const xText = createXMessage(calendar, url)

  return (
    <section class="mt-8 border border-(--color-border) bg-[#fff8ed] p-4">
      <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p class="text-xs font-semibold uppercase text-(--color-subtle)">Share</p>
          <h2 class="mt-1 text-lg font-semibold tracking-tight">参加者を招待する</h2>
          <p class="mt-2 max-w-2xl text-sm leading-6 text-(--color-muted)">
            {calendar.visibility === 'private' ? '限定共有のリレーは、このリンクを知っている人が開けます。' : '公開リレーのリンクと募集文を共有できます。'}
          </p>
        </div>
        <div class="flex flex-wrap gap-2">
          <button class="border border-(--color-border-strong) px-3 py-2 text-sm font-semibold hover:border-(--color-accent) hover:text-(--color-accent)" type="button" onClick={() => copy(url, 'リンクをコピーしました。')}>
            リンクをコピー
          </button>
          <button class="border border-(--color-border-strong) px-3 py-2 text-sm font-semibold hover:border-(--color-accent) hover:text-(--color-accent)" type="button" onClick={() => copy(slackText, 'Slack向け共有文をコピーしました。')}>
            Slack向け文をコピー
          </button>
          <button class="border border-(--color-border-strong) px-3 py-2 text-sm font-semibold hover:border-(--color-accent) hover:text-(--color-accent)" type="button" onClick={() => copy(discordText, 'Discord向け共有文をコピーしました。')}>
            Discord向け文をコピー
          </button>
          <button class="bg-(--color-text) px-3 py-2 text-sm font-semibold text-(--color-page) hover:bg-(--color-accent-hover)" type="button" onClick={() => copy(xText, 'X向け共有文をコピーしました。')}>
            X向け文をコピー
          </button>
        </div>
      </div>
      <p class="mt-4 break-all border-t border-(--color-border) pt-3 text-xs text-(--color-muted)">{notice}</p>
    </section>
  )
}

function createSlackMessage(calendar: Props['calendar'], url: string) {
  const dateRange = calendar.startDate && calendar.endDate ? `期間: ${calendar.startDate} - ${calendar.endDate}` : ''
  const visibility = calendar.visibility === 'private' ? '限定共有' : '公開中'
  const parts = [`「${calendar.title}」の参加者を募集しています。`, dateRange, `状態: ${visibility}`, url].filter(Boolean)

  return parts.join('\n')
}

function createDiscordMessage(calendar: Props['calendar'], url: string) {
  const dateRange = calendar.startDate && calendar.endDate ? `開催期間: ${calendar.startDate} - ${calendar.endDate}` : ''
  const parts = [`**${calendar.title}** の参加者を募集しています！`, dateRange, url].filter(Boolean)

  return parts.join('\n')
}

function createXMessage(calendar: Props['calendar'], url: string) {
  const dateRange = calendar.startDate && calendar.endDate ? ` (${calendar.startDate} - ${calendar.endDate})` : ''
  const hashtags = createXHashtags(calendar.tags)
  const parts = [`「${calendar.title}」の参加者を募集しています${dateRange}`, hashtags, url].filter(Boolean)

  return parts.join('\n')
}

function createXHashtags(tags: Array<{ name: string }>) {
  const hashtags = tags
    .map((tag) => tag.name.trim().replace(/^#/, '').replace(/\s+/g, ''))
    .filter(Boolean)
    .map((tagName) => `#${tagName}`)

  return ['#Reray', ...hashtags].join(' ')
}
