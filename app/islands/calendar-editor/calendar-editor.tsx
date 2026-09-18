import { useState } from 'hono/jsx'
import { CalendarEditorForm } from './calendar-editor-form'
import type { EditableCalendar } from './types'

type Props = {
  calendar: EditableCalendar
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
      <CalendarEditorForm calendar={calendar} />
    </section>
  )
}
