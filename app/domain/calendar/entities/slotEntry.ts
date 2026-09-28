import type { UserId } from "../../user/valueObjects/userId";
import type { SlotEntryId } from "../valueObjects/slotEntryId";
import type { SlotId } from "../valueObjects/slotId";

export type SlotEntry = {
  id: SlotEntryId;
  slotId: SlotId;
  userId: UserId | null;
  description: string | null;
  articleTitle: string | null;
  articleUrl: string | null;
  createdAt: number;
  updatedAt: number;
};

export type NewSlotEntry = SlotEntry;
