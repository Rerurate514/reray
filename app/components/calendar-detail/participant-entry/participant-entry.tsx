import { SlotArticle } from '../slot-article/index'
import { SlotUser } from '../slot-user/index'
import type { SlotParticipant } from '../types/index'

export function ParticipantEntry({
  calendarSlug,
  canRemove,
  entry,
  isCurrentUser,
  showEditLink = true,
  slotId,
}: {
  calendarSlug: string
  canRemove: boolean
  entry: SlotParticipant
  isCurrentUser: boolean
  showEditLink?: boolean
  slotId: string
}) {
  return (
    <div class="grid gap-2">
      <div class="flex min-w-0 flex-wrap items-center gap-2">
        <SlotUser participant={entry} />
        {isCurrentUser ? <span class="border border-(--color-border-strong) px-2 py-0.5 text-xs font-semibold text-(--color-muted)">自分</span> : null}
        {canRemove ? (
          <form method="post" action={`/api/slots/${slotId}/entries/${entry.entryId}/remove`}>
            <button class="text-xs font-semibold text-(--color-red) underline-offset-4 hover:underline" type="submit">外す</button>
          </form>
        ) : null}
      </div>
      {entry.description ? <p class="whitespace-pre-wrap text-sm leading-7 text-(--color-muted)">{entry.description}</p> : null}
      <SlotArticle compact participant={entry} />
      {isCurrentUser && showEditLink ? (
        <a class="w-fit text-xs font-semibold text-(--color-muted) underline-offset-4 hover:text-(--color-accent) hover:underline" href={`/c/${calendarSlug}/slots/${slotId}`}>枠ページで編集</a>
      ) : null}
    </div>
  )
}
