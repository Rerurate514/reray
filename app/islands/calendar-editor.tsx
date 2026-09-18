import { useState } from 'hono/jsx'

type Props = {
  calendar: {
    id: string
    title: string
    description: string | null
    tags: Array<{ name: string }>
  }
}

export default function CalendarEditor({ calendar }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  if (!isOpen) {
    return (
      <button
        class="border border-(--color-border-strong) px-3 py-2 text-sm font-semibold hover:border-(--color-accent) hover:text-(--color-accent)"
        type="button"
        onClick={() => setIsOpen(true)}
      >
        カレンダーを編集する
      </button>
    )
  }

  return (
    <section class="mb-12 grid gap-6 border-t border-(--color-border) pt-8">
      <div class="flex items-baseline justify-between gap-4">
        <div class="flex items-baseline">
          <span class="text-5xl font-light leading-none">Edit /</span>
          <span class="mt-2 text-sm italic text-(--color-muted)">Owner Settings</span>
        </div>
        <button
          class="border border-(--color-border) px-3 py-2 text-sm font-semibold text-(--color-muted) hover:border-(--color-accent) hover:text-(--color-text)"
          type="button"
          onClick={() => setIsOpen(false)}
        >
          閉じる
        </button>
      </div>
      <form method="post" action={`/api/calendars/${calendar.id}/update`} class="grid gap-5">
        <label class="grid gap-2">
          <span class="text-sm font-semibold">タイトル</span>
          <input class="reray-input px-3 py-3" name="title" value={calendar.title} required maxlength={120} />
        </label>
        <label class="grid gap-2">
          <span class="text-sm font-semibold">説明</span>
          <textarea class="reray-input min-h-28 px-3 py-3 leading-7" name="description">{calendar.description ?? ''}</textarea>
        </label>
        <label class="grid gap-2">
          <span class="text-sm font-semibold">タグ</span>
          <input class="reray-input px-3 py-3" name="tags" value={calendar.tags.map((tag) => tag.name).join(', ')} maxlength={200} />
          <span class="text-xs text-(--color-muted)">カンマ区切りで最大8個まで設定できます。</span>
        </label>
        <button class="w-fit bg-(--color-text) px-5 py-3 text-sm font-semibold text-(--color-page) hover:bg-(--color-accent-hover)" type="submit">内容を保存</button>
      </form>
    </section>
  )
}
