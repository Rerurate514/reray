import { useEffect, useState } from 'hono/jsx'

type Props = {
  calendarTitle: string
  showOpenLink?: boolean
  slotLabel: string
  slotUrl?: string
}

export default function SlotShare({ calendarTitle, showOpenLink = true, slotLabel, slotUrl }: Props) {
  const [url, setUrl] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    setUrl(slotUrl ? new URL(slotUrl, window.location.origin).toString() : `${window.location.origin}${window.location.pathname}`)
  }, [slotUrl])

  async function copy() {
    if (!navigator.clipboard || !url) {
      setNotice('コピーできませんでした。')
      return
    }

    await navigator.clipboard.writeText(createSlotShareMessage(calendarTitle, slotLabel, url))
    setNotice('空き枠の共有文をコピーしました。')
    window.setTimeout(() => setNotice(''), 1800)
  }

  return (
    <div class="mt-3 flex flex-wrap items-center gap-2">
      <button class="border border-(--color-border-strong) px-3 py-2 text-xs font-semibold text-(--color-muted) hover:border-(--color-accent) hover:text-(--color-accent)" type="button" onClick={copy}>
        この空き枠を共有
      </button>
      {slotUrl && showOpenLink ? (
        <a class="border border-(--color-border-strong) px-3 py-2 text-xs font-semibold text-(--color-muted) hover:border-(--color-accent) hover:text-(--color-accent)" href={slotUrl}>
          枠ページを開く
        </a>
      ) : null}
      {notice ? <span class="text-xs text-(--color-muted)">{notice}</span> : null}
    </div>
  )
}

function createSlotShareMessage(calendarTitle: string, slotLabel: string, url: string) {
  return `「${calendarTitle}」の ${slotLabel} の担当者を募集しています。\n${url}`
}
