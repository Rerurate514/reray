import type { MySlotSummary } from '../../application/calendar/dtos/mySlotSummary'

export function MySlotItem({ slot }: { slot: MySlotSummary }) {
  return (
    <article class="grid gap-4 border-t border-(--color-border) py-5">
      <div class="grid gap-2 sm:grid-cols-[9rem_1fr_auto] sm:items-start">
        <p class="text-sm font-semibold">{slot.scheduledDate ?? `#${slot.position}`}</p>
        <div>
          <a class="font-semibold text-(--color-accent) hover:text-(--color-accent-hover)" href={`/c/${slot.calendarSlug}`}>{slot.calendarTitle}</a>
          {slot.articleUrl ? (
            <a class="mt-1 block text-sm text-(--color-muted) underline-offset-4 hover:underline" href={slot.articleUrl} target="_blank" rel="noopener noreferrer">{slot.articleTitle}</a>
          ) : (
            <p class="mt-1 text-sm text-(--color-muted)">記事未登録</p>
          )}
        </div>
        <form method="post" action={`/api/slots/${slot.id}/cancel`}>
          <button class="border border-(--color-border-strong) px-3 py-2 text-sm font-semibold hover:border-(--color-accent) hover:text-(--color-accent)" type="submit">キャンセル</button>
        </form>
      </div>
      <form method="post" action={`/api/slots/${slot.id}/article`} class="grid gap-3 sm:grid-cols-[1fr_1.4fr_auto]">
        <input class="reray-input px-3 py-3" name="title" value={slot.articleTitle ?? ''} placeholder="記事タイトル（空ならURLから自動）" />
        <input class="reray-input px-3 py-3" name="url" value={slot.articleUrl ?? ''} placeholder="https://example.com/article" required />
        <button class="bg-(--color-text) px-4 py-3 text-sm font-semibold text-(--color-page) hover:bg-(--color-accent-hover)" type="submit">記事を保存</button>
      </form>
    </article>
  )
}
