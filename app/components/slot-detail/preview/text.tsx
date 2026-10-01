import type { SlotDetail } from "../../../application/calendar/dtos/slotDetail";
import type { SlotParticipant } from "../../../application/calendar/dtos/slotParticipant";
import { countActiveParticipants } from "../../../application/calendar/dtos/slotParticipant";
import { escapeDiscordMarkdown, trimUtf8 } from "../../shared/preview/index";

export function createSlotLabel(slot: {
  scheduledDate: string | null;
  position: number;
}) {
  return slot.scheduledDate ?? `#${slot.position}`;
}

export function createSlotStatusText(detail: SlotDetail) {
  const activeCount = countActiveParticipants(detail.slot.participants);
  const hasArticle = detail.slot.participants.some(
    (participant) => participant.articleUrl !== null,
  );

  if (hasArticle) {
    return "記事が登録されています";
  }

  if (activeCount >= detail.calendar.capacity) {
    return "定員に達しています";
  }

  return `募集中（あと ${Math.max(0, detail.calendar.capacity - activeCount)} 名）`;
}

export function createSlotParticipantsText(participants: SlotParticipant[]) {
  const names = participants
    .filter((participant) => participant.userId !== null)
    .map((participant) =>
      escapeDiscordMarkdown(
        participant.displayName ?? participant.username ?? "匿名",
      ),
    );

  return names.length > 0 ? names.join("、") : null;
}

export function findSlotArticle(participants: SlotParticipant[]) {
  return (
    participants.find((participant) => participant.articleUrl !== null) ?? null
  );
}

export function createSlotPreviewDescription(detail: SlotDetail) {
  const label = createSlotLabel(detail.slot);
  const article = findSlotArticle(detail.slot.participants);

  if (article) {
    return trimUtf8(
      `${detail.calendar.title} の ${label} の枠です。記事: ${
        article.articleTitle ?? article.articleUrl ?? ""
      }`,
      340,
    );
  }

  return `${detail.calendar.title} の ${label} の枠です。${createSlotStatusText(
    detail,
  )}`;
}
