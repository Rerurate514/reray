import type { MySlotSummary } from '../../../application/calendar/dtos/mySlotSummary'
import MySlotArticleForm from '../../../islands/my-slot-article-form/my-slot-article-form'

export function MySlotItem({ slot }: { slot: MySlotSummary }) {
  return (
    <article class="grid gap-4 border-t border-(--color-border) py-5">
      <div class="grid gap-2 sm:grid-cols-[9rem_1fr_auto] sm:items-start">
        <p class="text-sm font-semibold">{slot.scheduledDate ?? `#${slot.position}`}</p>
        <div>
          <a class="font-semibold text-(--color-accent) hover:text-(--color-accent-hover)" href={`/c/${slot.calendarSlug}`}>{slot.calendarTitle}</a>
          {slot.articleUrl ? (
            <div class="mt-2 border border-(--color-border) bg-[#fff8ed] p-3">
              <p class="text-xs font-semibold uppercase text-(--color-subtle)">Registered Article</p>
              <a class="mt-1 block text-sm font-semibold underline-offset-4 hover:text-(--color-accent) hover:underline" href={slot.articleUrl} target="_blank" rel="noopener noreferrer">
                {slot.articleTitle}
              </a>
              <p class="mt-1 truncate text-xs text-(--color-muted)">{slot.articleUrl}</p>
            </div>
          ) : (
            <p class="mt-1 text-sm text-(--color-muted)">記事未登録</p>
          )}
        </div>
        <form method="post" action={`/api/slots/${slot.id}/cancel`}>
          <button class="border border-(--color-border-strong) px-3 py-2 text-sm font-semibold hover:border-(--color-accent) hover:text-(--color-accent)" type="submit">キャンセル</button>
        </form>
      </div>
      <MySlotArticleForm action={`/api/slots/${slot.id}/article`} articleTitle={slot.articleTitle ?? ''} articleUrl={slot.articleUrl ?? ''} />
    </article>
  )
}
