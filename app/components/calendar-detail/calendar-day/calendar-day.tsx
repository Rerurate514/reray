import { isActiveParticipant } from "../../../application/calendar/dtos/slotParticipant";
import type { AuthenticatedUser } from "../../../domain/user/entities/user";
import JoinSlotButton from "../../../islands/join-slot-button";
import { SlotDate } from "../slot-date/index";
import { SlotUser } from "../slot-user/index";
import type { Slot } from "../types/index";
import { getUtcDate } from "../utc-date/index";

export function CalendarDay({
  calendarSlug,
  capacity,
  currentUser,
  slot,
}: {
  calendarSlug: string;
  capacity: number;
  currentUser: AuthenticatedUser | null;
  slot: Slot;
}) {
  const day = slot.scheduledDate
    ? getUtcDate(slot.scheduledDate)
    : slot.position;
  const hasJoined =
    currentUser !== null &&
    slot.participants.some((entry) => entry.userId === currentUser.id);
  const activeParticipants = slot.participants.filter(isActiveParticipant);
  const isFull = activeParticipants.length >= capacity;
  const [firstParticipant] =
    activeParticipants.length > 0 ? activeParticipants : slot.participants;

  return (
    <div class="min-h-28 border-b border-r border-(--color-border) bg-(--color-surface) p-2">
      <div class="grid h-full content-start gap-2">
        <SlotDate day={day} scheduledDate={slot.scheduledDate} />
        <div class="flex flex-wrap items-center gap-2">
          <a
            class="text-xs font-semibold text-(--color-accent) hover:text-(--color-accent-hover)"
            href={`/c/${calendarSlug}/slots/${slot.id}`}
          >
            詳細
          </a>
          {capacity > 1 ? (
            <span class="text-xs font-semibold text-(--color-muted)">
              {activeParticipants.length}/{capacity}
            </span>
          ) : null}
        </div>
        {firstParticipant ? (
          <div class="flex min-w-0 items-center gap-1">
            <SlotUser compact participant={firstParticipant} />
            {activeParticipants.length > 1 ? (
              <span class="shrink-0 text-xs font-semibold text-(--color-muted)">
                +{activeParticipants.length - 1}
              </span>
            ) : null}
          </div>
        ) : null}
        {currentUser && !hasJoined && !isFull ? (
          <JoinSlotButton
            className="text-left text-sm font-semibold text-(--color-accent) hover:text-(--color-accent-hover) disabled:opacity-60"
            label="参加する"
            slotId={slot.id}
            slotUrl={`/c/${calendarSlug}/slots/${slot.id}`}
          />
        ) : null}
        {isFull && capacity > 1 ? (
          <span class="text-xs font-semibold text-(--color-muted)">満員</span>
        ) : null}
      </div>
    </div>
  );
}
