import { useState } from 'hono/jsx'

type Props = {
  className: string
  label: string
  slotId: string
  slotUrl?: string
}

type JoinState = 'idle' | 'joining' | 'joined' | 'error'

export default function JoinSlotButton({ className, label, slotId, slotUrl }: Props) {
  const [state, setState] = useState<JoinState>('idle')

  async function join() {
    if (state === 'joining' || state === 'joined') {
      return
    }

    setState('joining')
    const response = await fetch(`/api/slots/${slotId}/join`, {
      method: 'POST',
      headers: {
        accept: 'application/json',
      },
    })

    if (!response.ok) {
      setState('error')
      return
    }

    setState('joined')
  }

  if (state === 'joined') {
    return (
      <span class="inline-flex flex-wrap items-center gap-2 text-sm font-semibold text-(--color-muted)">
        参加済みです
        {slotUrl ? <a class="text-(--color-accent) hover:text-(--color-accent-hover)" href={slotUrl}>枠ページへ</a> : null}
      </span>
    )
  }

  return (
    <span class="inline-grid gap-1">
      <button class={className} type="button" disabled={state === 'joining'} onClick={join}>
        {state === 'joining' ? '参加中...' : label}
      </button>
      {state === 'error' ? <span class="text-xs font-semibold text-(--color-red)">参加できませんでした。ページを更新して確認してください。</span> : null}
    </span>
  )
}
