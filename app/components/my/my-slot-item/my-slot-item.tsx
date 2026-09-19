import type { MySlotSummary } from '../../../application/calendar/dtos/mySlotSummary'

export function MySlotItem({ slot }: { slot: MySlotSummary }) {
  return (
    <article class="border-t border-(--color-border) py-5">
      <div class="grid gap-4 sm:grid-cols-[max-content_10rem_minmax(0,1fr)_auto_auto] sm:items-start">
        <p class="text-sm font-semibold">
          {slot.scheduledDate ?? `#${slot.position}`}
        </p>

        <div>
          <a
            class="font-semibold text-(--color-accent) hover:text-(--color-accent-hover)"
            href={`/c/${slot.calendarSlug}`}
          >
            {slot.calendarTitle}
          </a>

          {slot.description ? (
            <p class="mt-2 whitespace-pre-wrap text-sm leading-7 text-(--color-muted)">
              {slot.description}
            </p>
          ) : null}
        </div>

        <div class="min-w-0">
          {slot.articleUrl ? (
            <div class="w-full border border-(--color-border) bg-[#fff8ed] p-3">
              <p class="text-xs font-semibold uppercase text-(--color-subtle)">
                Registered Article
              </p>

              <a
                class="mt-1 block truncate text-sm font-semibold underline-offset-4 hover:text-(--color-accent) hover:underline"
                href={slot.articleUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {slot.articleTitle}
              </a>

              <p class="mt-1 truncate text-xs text-(--color-muted)">
                {slot.articleUrl}
              </p>
            </div>
          ) : (
            <p class="text-sm text-(--color-muted)">記事未登録</p>
          )}
        </div>

        <a
          class="whitespace-nowrap bg-(--color-text) px-4 py-2 text-sm font-semibold text-(--color-page) hover:bg-(--color-accent-hover)"
          href={`/c/${slot.calendarSlug}/slots/${slot.id}`}
        >
          枠ページで編集
        </a>

        <form method="post" action={`/api/slots/${slot.id}/cancel`}>
          <button
            class="whitespace-nowrap border border-(--color-border-strong) px-3 py-2 text-sm font-semibold hover:border-(--color-accent) hover:text-(--color-accent)"
            type="submit"
          >
            キャンセル
          </button>
        </form>
      </div>
    </article>
  )
}
