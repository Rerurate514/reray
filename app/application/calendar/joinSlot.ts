import { UserFacingError } from "../../domain/shared/errors/userFacingError";
import { createId } from "../../domain/shared/services/createId";
import type { CalendarRepository } from "./repositories/calendarRepository";

export async function joinSlot(
  calendarRepository: CalendarRepository,
  input: { slotId: string; userId: string },
) {
  const outcome = await calendarRepository.joinSlot({
    entryId: createId("entry"),
    slotId: input.slotId,
    userId: input.userId,
    now: Date.now(),
  });

  if (outcome === "joined") {
    return;
  }

  if (outcome === "slotNotFound") {
    throw new UserFacingError("notFound", "Slot not found");
  }

  if (outcome === "alreadyJoined") {
    throw new UserFacingError("conflict", "You have already joined this slot");
  }

  throw new UserFacingError("conflict", "Slot is full");
}
