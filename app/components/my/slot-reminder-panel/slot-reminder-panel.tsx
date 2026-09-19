import type { MySlotSummary } from '../../../application/calendar/dtos/mySlotSummary'

const nearDeadlineDays = 3

export function SlotReminderPanel({ slots }: { slots: MySlotSummary[] }) {
  const unregisteredSlots = slots.filter((slot) => !slot.articleUrl)
  const nearDeadlineSlots = slots.filter(isNearDeadlineSlot)

  if (unregisteredSlots.length < 1 && nearDeadlineSlots.length < 1) {
    return null
  }

  return (
    <section class="mt-8 border border-(--color-border) bg-[#fff8ed] p-5">
      <div class="flex flex-wrap items-end justify-between gap-3 border-b border-(--color-border) pb-4">
        <div>
          <p class="text-xs font-semibold uppercase text-(--color-accent)">Reminder</p>
          <h2 class="mt-2 text-2xl font-semibold tracking-tight">記事登録の確認</h2>
        </div>
        <p class="text-sm font-semibold text-(--color-muted)">
          未登録 {unregisteredSlots.length}件 / 締切間近 {nearDeadlineSlots.length}件
        </p>
      </div>
      <div class="mt-5 grid gap-6 md:grid-cols-2">
        <ReminderList emptyText="未登録の担当枠はありません。" slots={unregisteredSlots} title="未登録の枠" />
        <ReminderList emptyText="3日以内の担当枠はありません。" slots={nearDeadlineSlots} title="締切が近い枠" />
      </div>
    </section>
  )
}

function ReminderList({ emptyText, slots, title }: { emptyText: string; slots: MySlotSummary[]; title: string }) {
  return (
    <div>
      <h3 class="text-sm font-semibold">{title}</h3>
      {slots.length > 0 ? (
        <div class="mt-3 divide-y divide-(--color-border)">
          {slots.slice(0, 5).map((slot) => <ReminderItem slot={slot} />)}
        </div>
      ) : (
        <p class="mt-3 text-sm text-(--color-muted)">{emptyText}</p>
      )}
    </div>
  )
}

function ReminderItem({ slot }: { slot: MySlotSummary }) {
  return (
    <a class="block py-3 hover:text-(--color-accent)" href="/my-schedule">
      <span class="block text-sm font-semibold">{slot.scheduledDate ?? `#${slot.position}`} / {slot.calendarTitle}</span>
      <span class="mt-1 block text-xs text-(--color-muted)">
        {slot.articleUrl ? slot.articleTitle : '記事URLが未登録です。'}
      </span>
    </a>
  )
}

function isNearDeadlineSlot(slot: MySlotSummary) {
  if (!slot.scheduledDate) {
    return false
  }

  const today = new Date()
  const todayUtc = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  const scheduledUtc = Date.parse(`${slot.scheduledDate}T00:00:00.000Z`)
  const diffDays = Math.floor((scheduledUtc - todayUtc) / 86_400_000)

  return diffDays >= 0 && diffDays <= nearDeadlineDays
}
