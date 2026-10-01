import type { CalendarRepository } from "./repositories/calendarRepository";
import { buildRelayBaton } from "./services/buildRelayBaton";

export async function getSlotDetail(
  calendarRepository: CalendarRepository,
  input: { calendarSlug: string; slotId: string },
) {
  const detail = await calendarRepository.findSlotDetail(
    input.calendarSlug,
    input.slotId,
  );

  if (!detail) {
    return null;
  }

  const links = await calendarRepository.listRelayLinksByCalendar(
    detail.calendar.id,
  );

  return {
    ...detail,
    relay: buildRelayBaton(links, detail.slot.position),
  };
}
