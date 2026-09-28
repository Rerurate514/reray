import type { NewCalendar } from "../../../domain/calendar/entities/calendar";
import type { NewSlot } from "../../../domain/calendar/entities/slot";
import type { CalendarDetail } from "../dtos/calendarDetail";
import type { CalendarSummary } from "../dtos/calendarSummary";
import type { MySlotSummary } from "../dtos/mySlotSummary";
import type { SlotDetail } from "../dtos/slotDetail";

export type PublicCalendarStatusFilter = "all" | "open" | "upcoming" | "ended";

export type PublicCalendarFilters = {
  query?: string;
  tag?: string;
  status?: PublicCalendarStatusFilter;
  today?: string;
};

export type JoinSlotOutcome =
  | "joined"
  | "alreadyJoined"
  | "full"
  | "slotNotFound";

export type CalendarRepository = {
  createWithSlots(
    calendar: NewCalendar,
    slots: NewSlot[],
    tagNames: string[],
  ): Promise<void>;
  findDetailBySlug(slug: string): Promise<CalendarDetail | null>;
  findSlotDetail(
    calendarSlug: string,
    slotId: string,
  ): Promise<SlotDetail | null>;
  listPublishedPublic(
    limit: number,
    filters?: PublicCalendarFilters,
  ): Promise<CalendarSummary[]>;
  listPublishedPublicByOwner(userId: string): Promise<CalendarSummary[]>;
  listCalendarsByOwner(userId: string): Promise<CalendarSummary[]>;
  findOwnerId(calendarId: string): Promise<string | null>;
  findMaxActiveParticipantCount(calendarId: string): Promise<number>;
  updateCalendar(input: {
    calendarId: string;
    title: string;
    description: string | null;
    visibility: "public" | "private";
    capacity: number;
    tagNames: string[];
    now: number;
  }): Promise<boolean>;
  deleteCalendar(calendarId: string): Promise<boolean>;
  joinSlot(input: {
    entryId: string;
    slotId: string;
    userId: string;
    now: number;
  }): Promise<JoinSlotOutcome>;
  cancelSlot(input: {
    slotId: string;
    userId: string;
    now: number;
  }): Promise<boolean>;
  removeSlotEntry(input: { entryId: string; now: number }): Promise<boolean>;
  findEntryOwner(entryId: string): Promise<string | null>;
  findEntryCalendarOwner(entryId: string): Promise<string | null>;
  findEntryByUser(input: {
    slotId: string;
    userId: string;
  }): Promise<{ id: string; calendarId: string } | null>;
  findArticleEntryIdByUrl(input: {
    calendarId: string;
    url: string;
  }): Promise<string | null>;
  updateSlotArticle(input: {
    entryId: string;
    title: string;
    url: string;
    now: number;
  }): Promise<boolean>;
  updateSlotDescription(input: {
    entryId: string;
    description: string | null;
    now: number;
  }): Promise<boolean>;
  listPublishedPublicSlotsByUser(userId: string): Promise<MySlotSummary[]>;
  listSlotsByUser(userId: string): Promise<MySlotSummary[]>;
};
