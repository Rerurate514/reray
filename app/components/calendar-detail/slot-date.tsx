export function SlotDate({ day, scheduledDate }: { day: number; scheduledDate: string | null }) {
  return (
    <span>
      <span class="block text-2xl font-light leading-none">{day}</span>
      <span class="mt-1 block text-xs text-(--color-muted)">{scheduledDate}</span>
    </span>
  )
}
