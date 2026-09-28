import type { SlotParticipant } from '../types/index'

export function SlotUser({ compact = false, participant }: { compact?: boolean; participant: SlotParticipant }) {
  const displayName = participant.displayName ?? participant.username ?? 'user'
  const content = (
    <>
      {participant.avatarUrl ? (
        <img class="h-7 w-7 rounded-full border border-(--color-border-strong) object-cover" src={participant.avatarUrl} alt={displayName} />
      ) : (
        <span class="grid h-7 w-7 place-items-center rounded-full border border-(--color-border-strong) text-xs font-semibold text-(--color-muted)">{displayName.slice(0, 1)}</span>
      )}
      {compact ? <span class="min-w-0 truncate text-sm font-semibold">{displayName}</span> : <p class="font-semibold">{displayName}</p>}
    </>
  )

  return participant.username ? (
    <a class="flex min-w-0 items-center gap-2 hover:text-(--color-accent)" href={`/u/${participant.username}`}>{content}</a>
  ) : (
    <div class="flex min-w-0 items-center gap-2">{content}</div>
  )
}
