import type { MySlotSummary } from '../../../application/calendar/dtos/mySlotSummary'
import { EmptyState } from '../empty-state/index'
import { MySlotItem } from '../my-slot-item/index'

export function MySlotsSection({ slots }: { slots: MySlotSummary[] }) {
  return (
    <section class="mt-10">
      <div class="border-b border-(--color-border) pb-3">
        <h2 class="text-lg font-semibold tracking-tight">参加している枠</h2>
      </div>
      {slots.length > 0 ? (
        <div class="mt-8 border-b border-(--color-border)">
          {slots.map((slot) => <MySlotItem slot={slot} />)}
        </div>
      ) : (
        <EmptyState
          actionHref="/"
          actionLabel="公開リレーを見る"
          body="公開リレーや共有された限定リレーの空き枠に参加すると、ここで記事URLを管理できます。"
          title="まだ担当している枠はありません"
          variant="secondary"
        />
      )}
    </section>
  )
}
