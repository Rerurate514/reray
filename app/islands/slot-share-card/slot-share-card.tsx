import { useEffect, useState } from 'hono/jsx'

type Props = {
  calendarTitle: string
  isRegistered: boolean
  slotLabel: string
  slotUrl: string
}

export default function SlotShareCard({ calendarTitle, isRegistered, slotLabel, slotUrl }: Props) {
  const [url, setUrl] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    setUrl(new URL(slotUrl, window.location.origin).toString())
  }, [slotUrl])

  async function copy(value: string, copiedMessage: string) {
    if (!navigator.clipboard || !value) {
      setNotice('コピーできませんでした。表示された文を選択してコピーしてください。')
      return
    }

    await navigator.clipboard.writeText(value)
    setNotice(copiedMessage)
    window.setTimeout(() => setNotice(''), 1800)
  }

  const shareMessage = createShareMessage(calendarTitle, isRegistered, slotLabel, url)
  const xMessage = createXMessage(calendarTitle, isRegistered, slotLabel, url)
  const discordMessage = createDiscordMessage(calendarTitle, isRegistered, slotLabel, url)

  return (
    <section class="border border-(--color-border) p-5">
      <h2 class="text-lg font-semibold">この枠を共有</h2>
      <p class="mt-2 max-w-2xl text-sm leading-6 text-(--color-muted)">
        {isRegistered ? '枠ページのリンクと共有文をコピーできます。' : '空き枠の募集文とリンクをコピーして、そのまま共有できます。'}
      </p>
      <div class="mt-4 flex flex-wrap items-center gap-2">
        <button class="bg-(--color-text) px-4 py-2 text-sm font-semibold text-(--color-page) hover:bg-(--color-accent-hover)" type="button" onClick={() => copy(shareMessage, isRegistered ? '枠の共有文をコピーしました。' : '空き枠の募集文をコピーしました。')}>
          共有文をコピー
        </button>
        <button class="border border-(--color-border-strong) px-4 py-2 text-sm font-semibold text-(--color-muted) hover:border-(--color-accent) hover:text-(--color-accent)" type="button" onClick={() => copy(xMessage, 'X向け共有文をコピーしました。')}>
          X向け文をコピー
        </button>
        <button class="border border-(--color-border-strong) px-4 py-2 text-sm font-semibold text-(--color-muted) hover:border-(--color-accent) hover:text-(--color-accent)" type="button" onClick={() => copy(discordMessage, 'Discord向け共有文をコピーしました。')}>
          Discord向け文をコピー
        </button>
        <button class="border border-(--color-border-strong) px-4 py-2 text-sm font-semibold text-(--color-muted) hover:border-(--color-accent) hover:text-(--color-accent)" type="button" onClick={() => copy(url, 'リンクをコピーしました。')}>
          リンクをコピー
        </button>
      </div>
      {notice ? <p class="mt-3 text-xs font-semibold text-(--color-muted)">{notice}</p> : null}
    </section>
  )
}

function createShareMessage(calendarTitle: string, isRegistered: boolean, slotLabel: string, url: string) {
  return isRegistered
    ? `「${calendarTitle}」の ${slotLabel} の枠はこちら。\n${url}`
    : `「${calendarTitle}」の ${slotLabel} の担当者を募集しています。\n${url}`
}

function createXMessage(calendarTitle: string, isRegistered: boolean, slotLabel: string, url: string) {
  const hashtags = ['#Reray', createCalendarHashtag(calendarTitle)].filter(Boolean).join(' ')
  return isRegistered
    ? `「${calendarTitle}」の ${slotLabel} の枠はこちら。\n${hashtags}\n${url}`
    : `「${calendarTitle}」の ${slotLabel} の担当者を募集しています。\n${hashtags}\n${url}`
}

function createCalendarHashtag(calendarTitle: string) {
  const tagName = calendarTitle.trim().replace(/^#/, '').replace(/\s+/g, '')
  return tagName ? `#${tagName}` : ''
}

function createDiscordMessage(calendarTitle: string, isRegistered: boolean, slotLabel: string, url: string) {
  return isRegistered
    ? `**${calendarTitle}** の ${slotLabel} の枠はこちら！\n${url}`
    : `**${calendarTitle}** の ${slotLabel} の担当者を募集しています！\n${url}`
}