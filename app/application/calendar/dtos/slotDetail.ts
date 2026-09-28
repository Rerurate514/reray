import type { SlotParticipant } from "./slotParticipant";

export type SlotDetail = {
  calendar: {
    id: string;
    ownerId: string | null;
    slug: string;
    title: string;
    visibility: "public" | "private";
    capacity: number;
  };
  slot: {
    id: string;
    scheduledDate: string | null;
    position: number;
    participants: SlotParticipant[];
  };
};
