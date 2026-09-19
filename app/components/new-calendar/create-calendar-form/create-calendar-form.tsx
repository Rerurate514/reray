import { RerayRule } from '../../shared/reray-rule/index'
import { CalendarBasicsFields } from '../fields/index'
import { FrequencyFields } from '../frequency-fields/index'
import { ScheduleFields } from '../schedule-fields/index'
import { VisibilityFields } from '../visibility-fields/index'

export function CreateCalendarForm() {
  return (
    <form method="post" class="grid gap-6 border-t border-(--color-border) pt-6">
      <div>
        <div class="bg-(--color-text) px-4 py-3 text-xl font-semibold tracking-tight text-(--color-page)">記事リレーを作成</div>
        <p class="mt-5 max-w-xl text-sm leading-7 text-(--color-muted)">テーマと期間を決めると、投稿枠を自動生成します。</p>
        <RerayRule class="mt-6" />
      </div>
      <CalendarBasicsFields />
      <VisibilityFields />
      <ScheduleFields />
      <FrequencyFields />
      <button class="bg-(--color-text) px-5 py-3 font-semibold text-(--color-page) hover:bg-(--color-accent-hover)" type="submit">作成する</button>
    </form>
  )
}
