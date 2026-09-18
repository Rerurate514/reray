export function CalendarBasicsFields() {
  return (
    <>
      <label class="grid gap-2">
        <span class="text-sm font-semibold">タイトル</span>
        <input class="reray-input px-3 py-3" name="title" required maxlength={120} placeholder="Flutter を30日間語る" />
      </label>
      <label class="grid gap-2">
        <span class="text-sm font-semibold">説明</span>
        <textarea class="reray-input min-h-28 px-3 py-3 leading-7" name="description" placeholder="テーマや参加条件を書いてください" />
      </label>
      <label class="grid gap-2">
        <span class="text-sm font-semibold">タグ</span>
        <input class="reray-input px-3 py-3" name="tags" maxlength={200} placeholder="flutter, zenn, advent calendar" />
        <span class="text-xs text-(--color-muted)">カンマ区切りで最大8個まで設定できます。</span>
      </label>
    </>
  )
}
