import { countActiveParticipants } from "../../../application/calendar/dtos/slotParticipant";
import type { AuthenticatedUser } from "../../../domain/user/entities/user";
import { AssignedSlot } from "../assigned-slot/index";
import { EmptySlot } from "../empty-slot/index";
import { SlotActions } from "../slot-actions/index";
import type { Slot } from "../types/index";

export function SlotRow({
  capacity,
  calendarTitle,
  calendarSlug,
  currentUser,
  isOwner,
  onJoined,
  slot,
}: {
  capacity: number;
  calendarTitle: string;
  calendarSlug: string;
  currentUser: AuthenticatedUser | null;
  isOwner: boolean;
  onJoined?: () => void;
  slot: Slot;
}) {
  return (
    <article class="grid gap-3 border-t border-(--color-border) py-4 sm:grid-cols-[7rem_minmax(0,1fr)_7.5rem] sm:items-start">
      <div class="min-w-0">
        <p class="text-sm font-semibold">
          {slot.scheduledDate ?? `#${slot.position}`}
        </p>
        {capacity > 1 ? (
          <p class="mt-1 text-xs text-(--color-muted)">
            {countActiveParticipants(slot.participants)} / {capacity} 名
          </p>
        ) : null}
      </div>
      <div class="min-w-0">
        {slot.participants.length > 0 ? (
          <AssignedSlot
            calendarSlug={calendarSlug}
            currentUserId={currentUser?.id ?? null}
            isOwner={isOwner}
            slot={slot}
          />
        ) : (
          <EmptySlot
            calendarSlug={calendarSlug}
            calendarTitle={calendarTitle}
            capacity={capacity}
            slot={slot}
          />
        )}
      </div>
      <SlotActions
        capacity={capacity}
        currentUser={currentUser}
        onJoined={onJoined}
        slot={slot}
      />
    </article>
  );
}
