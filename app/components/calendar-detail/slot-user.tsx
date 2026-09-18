import type { Slot } from './types'

export function SlotUser({ compact = false, slot }: { compact?: boolean; slot: Slot }) {
  const displayName = slot.displayName ?? slot.username ?? 'user'

  return (
    <div class="flex items-center gap-2">
      {slot.avatarUrl ? (
        <img class="h-7 w-7 rounded-full border border-(--color-border-strong) object-cover" src={slot.avatarUrl} alt={displayName} />
      ) : (
        <span class="grid h-7 w-7 place-items-center rounded-full border border-(--color-border-strong) text-xs font-semibold text-(--color-muted)">{displayName.slice(0, 1)}</span>
      )}
      {compact ? <span class="min-w-0 truncate text-sm font-semibold">{displayName}</span> : <p class="font-semibold">{displayName}</p>}
    </div>
  )
}
