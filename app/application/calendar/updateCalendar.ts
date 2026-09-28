import { normalizeCalendarDescription } from "../../domain/calendar/services/normalizeCalendarDescription";
import { normalizeCalendarTitle } from "../../domain/calendar/services/normalizeCalendarTitle";
import { normalizeCalendarVisibility } from "../../domain/calendar/services/normalizeCalendarVisibility";
import { normalizeSlotCapacity } from "../../domain/calendar/services/normalizeSlotCapacity";
import { UserFacingError } from "../../domain/shared/errors/userFacingError";
import { normalizeTagNames } from "../../domain/tag/services/normalizeTagNames";
import type { CalendarRepository } from "./repositories/calendarRepository";

export async function updateCalendar(
  calendarRepository: CalendarRepository,
  input: {
    calendarId: string;
    userId: string;
    title: string;
    description?: string;
    visibility?: string;
    capacity?: string | number;
    tags?: string;
  },
) {
  const ownerId = await calendarRepository.findOwnerId(input.calendarId);
  if (!ownerId) {
    throw new UserFacingError("notFound", "Calendar not found");
  }

  if (ownerId !== input.userId) {
    throw new UserFacingError(
      "forbidden",
      "Only the owner can edit this calendar",
    );
  }

  const capacity = normalizeSlotCapacity(input.capacity);
  const maxActiveParticipantCount =
    await calendarRepository.findMaxActiveParticipantCount(input.calendarId);
  if (capacity < maxActiveParticipantCount) {
    throw new UserFacingError(
      "validation",
      `Capacity must be at least ${maxActiveParticipantCount}`,
    );
  }

  const updated = await calendarRepository.updateCalendar({
    calendarId: input.calendarId,
    title: normalizeCalendarTitle(input.title),
    description: normalizeCalendarDescription(input.description),
    visibility: normalizeCalendarVisibility(input.visibility),
    capacity,
    tagNames: normalizeTagNames(input.tags),
    now: Date.now(),
  });

  if (!updated) {
    throw new UserFacingError("notFound", "Calendar not found");
  }
}
