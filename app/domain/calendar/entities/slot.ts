import type { CalendarId } from "../valueObjects/calendarId";
import type { SlotId } from "../valueObjects/slotId";

export type NewSlot = {
  id: SlotId;
  calendarId: CalendarId;
  scheduledDate: string | null;
  position: number;
  createdAt: number;
  updatedAt: number;
};

export type GeneratedSlot = {
  scheduledDate: string;
  position: number;
};
