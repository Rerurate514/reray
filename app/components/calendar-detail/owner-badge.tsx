import type { Calendar } from './types'

export function OwnerBadge({ calendar }: { calendar: Calendar }) {
  return (
    <div class="mt-3 flex items-center gap-2 text-sm italic text-(--color-muted)">
      {calendar.owner.avatarUrl ? (
        <img class="h-6 w-6 rounded-full border border-(--color-border-strong) object-cover" src={calendar.owner.avatarUrl} alt={calendar.owner.displayName} />
      ) : (
        <span class="grid h-6 w-6 place-items-center rounded-full border border-(--color-border-strong) text-xs not-italic">{calendar.owner.displayName.slice(0, 1)}</span>
      )}
      <span>{calendar.owner.displayName}</span>
    </div>
  )
}
