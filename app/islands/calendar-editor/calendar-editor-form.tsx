import { CalendarVisibilityFields } from "./calendar-visibility-fields";
import type { EditableCalendar } from "./types";

export function CalendarEditorForm({
  calendar,
}: {
  calendar: EditableCalendar;
}) {
  return (
    <form
      method="post"
      action={`/api/calendars/${calendar.id}/update`}
      class="grid gap-5"
    >
      <label class="grid gap-2">
        <span class="text-sm font-semibold">タイトル</span>
        <input
          class="reray-input px-3 py-3"
          name="title"
          value={calendar.title}
          required
          maxlength={120}
        />
      </label>
      <label class="grid gap-2">
        <span class="text-sm font-semibold">説明</span>
        <textarea
          class="reray-input min-h-28 px-3 py-3 leading-7"
          name="description"
          maxlength={2000}
        >
          {calendar.description ?? ""}
        </textarea>
      </label>
      <label class="grid gap-2">
        <span class="text-sm font-semibold">タグ</span>
        <input
          class="reray-input px-3 py-3"
          name="tags"
          value={calendar.tags.map((tag) => tag.name).join(", ")}
          maxlength={200}
        />
        <span class="text-xs text-(--color-muted)">
          カンマ区切りで最大8個まで設定できます。
        </span>
      </label>
      <label class="grid gap-2">
        <span class="text-sm font-semibold">1枠あたりの定員</span>
        <input
          class="reray-input w-32 px-3 py-3"
          type="number"
          name="capacity"
          value={calendar.capacity}
          min={1}
          max={99}
          required
        />
        <span class="text-xs text-(--color-muted)">
          同じ日に参加できる人数です。1 なら1人1枠、2
          以上なら複数人で1つの枠を分担できます。
        </span>
      </label>
      <CalendarVisibilityFields visibility={calendar.visibility} />
      <button
        class="w-fit bg-(--color-text) px-5 py-3 text-sm font-semibold text-(--color-page) hover:bg-(--color-accent-hover)"
        type="submit"
      >
        内容を保存
      </button>
    </form>
  );
}
