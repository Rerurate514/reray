import { countActiveParticipants } from "../../../application/calendar/dtos/slotParticipant";
import { buildRelayBatons } from "../../../application/calendar/services/buildRelayBaton";
import type { AuthenticatedUser } from "../../../domain/user/entities/user";
import CalendarSlotRow from "../../../islands/calendar-slot-row";
import { SectionNumber } from "../../shared/section-number/index";
import { SlotRow } from "../slot-row/index";
import type { Slot } from "../types/index";

export function SlotsSection({
  capacity,
  calendarTitle,
  calendarSlug,
  currentUser,
  isOwner,
  slots,
}: {
  capacity: number;
  calendarTitle: string;
  calendarSlug: string;
  currentUser: AuthenticatedUser | null;
  isOwner: boolean;
  slots: Slot[];
}) {
  const relayBySlotId = buildRelayBatons(slots);

  return (
    <section class="grid gap-6">
      <SectionNumber number="03 /" label="Slots" />
      <div class="border-b border-(--color-border)">
        {slots.map((slot) =>
          currentUser &&
          countActiveParticipants(slot.participants) < capacity &&
          !slot.participants.some(
            (entry) => entry.userId === currentUser.id,
          ) ? (
            <CalendarSlotRow
              capacity={capacity}
              calendarSlug={calendarSlug}
              calendarTitle={calendarTitle}
              currentUser={currentUser}
              isOwner={isOwner}
              relay={relayBySlotId.get(slot.id) ?? null}
              slot={slot}
            />
          ) : (
            <SlotRow
              capacity={capacity}
              calendarSlug={calendarSlug}
              calendarTitle={calendarTitle}
              currentUser={currentUser}
              isOwner={isOwner}
              relay={relayBySlotId.get(slot.id) ?? null}
              slot={slot}
            />
          ),
        )}
      </div>
    </section>
  );
}
