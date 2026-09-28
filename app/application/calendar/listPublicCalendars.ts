import { normalizeTagNames } from "../../domain/tag/services/normalizeTagNames";
import type {
  CalendarRepository,
  PublicCalendarStatusFilter,
} from "./repositories/calendarRepository";

const pageSize = 24;

export type ListPublicCalendarsInput = {
  query?: string;
  tag?: string;
  status?: string;
  page?: string;
};

export type PublicCalendarSearch = {
  query: string;
  tag: string;
  status: PublicCalendarStatusFilter;
  page: number;
};

export async function listPublicCalendars(
  calendarRepository: CalendarRepository,
  input: ListPublicCalendarsInput = {},
) {
  const search = normalizePublicCalendarSearch(input);
  const calendars = await calendarRepository.listPublishedPublic(
    pageSize + 1,
    {
      query: search.query || undefined,
      tag: search.tag || undefined,
      status: search.status,
      today: formatToday(),
    },
    (search.page - 1) * pageSize,
  );
  const hasNext = calendars.length > pageSize;

  return {
    calendars: calendars.slice(0, pageSize),
    search,
    hasNext,
    hasPrev: search.page > 1,
  };
}

function normalizePublicCalendarSearch(
  input: ListPublicCalendarsInput,
): PublicCalendarSearch {
  const query = String(input.query ?? "")
    .trim()
    .slice(0, 80);
  const tag = normalizeTagNames(input.tag)[0] ?? "";
  const status = normalizeStatus(input.status);
  const page = normalizePage(input.page);

  return { query, tag, status, page };
}

function normalizeStatus(
  value: string | undefined,
): PublicCalendarStatusFilter {
  if (value === "open" || value === "upcoming" || value === "ended") {
    return value;
  }

  return "all";
}

function normalizePage(value: string | undefined) {
  const page = Number.parseInt(String(value ?? ""), 10);

  return Number.isFinite(page) && page > 1 ? page : 1;
}

function formatToday() {
  return new Date().toISOString().slice(0, 10);
}
