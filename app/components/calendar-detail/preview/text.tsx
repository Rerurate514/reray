import { countActiveParticipants } from "../../../application/calendar/dtos/slotParticipant";
import { buildRelayProgress } from "../../../application/calendar/services/buildRelayProgress";
import {
  createDateRangeText,
  escapeDiscordMarkdown,
  trimUtf8,
} from "../../shared/preview/index";
import type { Calendar, Slot } from "../types/index";

export type PreviewField = {
  label: string;
  value: string;
};

export function createCalendarPreviewDescription(calendar: Calendar) {
  const parts = [
    calendar.description?.trim(),
    createDateRangeText(calendar.startDate, calendar.endDate),
    calendar.tags.length > 0
      ? calendar.tags.map((tag) => `#${tag.name}`).join(" ")
      : null,
  ].filter(Boolean);

  return trimUtf8(parts.join("\n"), 340);
}

export function createRelayProgressText(slots: Slot[]): PreviewField {
  const progress = buildRelayProgress(slots);
  const percent =
    progress.totalSlots === 0
      ? 0
      : Math.round((progress.articleSlots / progress.totalSlots) * 100);

  return {
    label: "進捗",
    value: [
      `記事 ${progress.articleSlots} / ${progress.totalSlots} 枠（${percent}%）`,
      `参加 ${countRelayParticipants(slots)} 名・空き ${progress.emptySlots} 枠`,
    ].join("\n"),
  };
}

export function countRelayParticipants(slots: Slot[]) {
  const userIds = new Set<string>();

  for (const slot of slots) {
    for (const participant of slot.participants) {
      if (participant.userId !== null) {
        userIds.add(participant.userId);
      }
    }
  }

  return userIds.size;
}

export function createNextOpenSlotText(
  slots: Slot[],
  capacity: number,
): PreviewField {
  const openSlot = findNextOpenSlot(slots, capacity);

  if (!openSlot) {
    return {
      label: "直近の空き枠",
      value: "ありません",
    };
  }

  return {
    label: "直近の空き枠",
    value: openSlot.scheduledDate ?? `#${openSlot.position}`,
  };
}

export function findNextOpenSlot(slots: Slot[], capacity: number) {
  return slots
    .filter((slot) => countActiveParticipants(slot.participants) < capacity)
    .sort((a, b) => {
      if (a.scheduledDate && b.scheduledDate) {
        return (
          a.scheduledDate.localeCompare(b.scheduledDate) ||
          a.position - b.position
        );
      }

      if (a.scheduledDate) {
        return -1;
      }

      if (b.scheduledDate) {
        return 1;
      }

      return a.position - b.position;
    })[0];
}

export function findFirstArticleSlot(slots: Slot[]) {
  return (
    slots.find((slot) =>
      slot.participants.some((participant) => participant.articleUrl !== null),
    ) ?? null
  );
}

export function createTagText(calendar: Calendar) {
  if (calendar.tags.length === 0) {
    return null;
  }

  return calendar.tags
    .map((tag) => `\`${escapeDiscordMarkdown(tag.name)}\``)
    .join(" ");
}
