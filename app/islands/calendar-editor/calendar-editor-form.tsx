import { CalendarVisibilityFields } from './calendar-visibility-fields'
import type { EditableCalendar } from './types'

export function CalendarEditorForm({ calendar }: { calendar: EditableCalendar }) {
  return (
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
      <CalendarVisibilityFields visibility={calendar.visibility} />
      <button class="w-fit bg-(--color-text) px-5 py-3 text-sm font-semibold text-(--color-page) hover:bg-(--color-accent-hover)" type="submit">内容を保存</button>
    </form>
  )
}
