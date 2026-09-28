import { useState } from "hono/jsx";
import type { RelayBaton } from "../../application/calendar/dtos/relayBaton";
import { SlotRow } from "../../components/calendar-detail/slot-row";
import type { Slot } from "../../components/calendar-detail/types";
import type { AuthenticatedUser } from "../../domain/user/entities/user";

type Props = {
  capacity: number;
  calendarSlug: string;
  calendarTitle: string;
  currentUser: AuthenticatedUser;
  isOwner: boolean;
  relay: RelayBaton | null;
  slot: Slot;
};

export default function CalendarSlotRow({
  capacity,
  calendarSlug,
  calendarTitle,
  currentUser,
  isOwner,
  relay,
  slot,
}: Props) {
  const [currentSlot, setCurrentSlot] = useState(slot);

  function markJoined() {
    setCurrentSlot({
      ...currentSlot,
      participants: [
        ...currentSlot.participants,
        {
          entryId: "",
          userId: currentUser.id,
          username: currentUser.username,
          displayName: currentUser.displayName,
          avatarUrl: currentUser.avatarUrl,
          description: null,
          articleTitle: null,
          articleUrl: null,
        },
      ],
    });
  }

  return (
    <SlotRow
      capacity={capacity}
      calendarSlug={calendarSlug}
      calendarTitle={calendarTitle}
      currentUser={currentUser}
      isOwner={isOwner}
      onJoined={markJoined}
      relay={relay}
      slot={currentSlot}
    />
  );
}
