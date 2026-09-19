export function FrequencyFields() {
  return (
    <fieldset class="grid gap-3 border-t border-(--color-border) pt-5">
      <legend class="text-sm font-semibold">枠の生成</legend>
      <label class="flex items-center gap-3 text-sm">
        <input class="accent-(--color-accent)" type="radio" name="frequency" value="daily" checked />
        <span>毎日</span>
      </label>
      <label class="flex items-center gap-3 text-sm">
        <input class="accent-(--color-accent)" type="radio" name="frequency" value="weekdays" />
        <span>平日のみ</span>
      </label>
    </fieldset>
  )
}
