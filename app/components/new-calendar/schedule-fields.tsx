export function ScheduleFields() {
  return (
    <div class="grid gap-4 sm:grid-cols-2">
      <label class="grid gap-2">
        <span class="text-sm font-semibold">開始日</span>
        <input class="reray-input px-3 py-3" type="date" name="startDate" required />
      </label>
      <label class="grid gap-2">
        <span class="text-sm font-semibold">終了日</span>
        <input class="reray-input px-3 py-3" type="date" name="endDate" required />
      </label>
    </div>
  )
}
