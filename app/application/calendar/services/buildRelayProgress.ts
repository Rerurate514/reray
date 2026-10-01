export type RelayProgressSlot = {
  participants: Array<{
    userId: string | null;
    articleUrl: string | null;
  }>;
};

export type RelayProgress = {
  totalSlots: number;
  filledSlots: number;
  articleSlots: number;
  emptySlots: number;
};

export function buildRelayProgress(slots: RelayProgressSlot[]): RelayProgress {
  const filledSlots = slots.filter((slot) =>
    slot.participants.some((participant) => participant.userId !== null),
  ).length;
  const articleSlots = slots.filter((slot) =>
    slot.participants.some((participant) => participant.articleUrl !== null),
  ).length;

  return {
    totalSlots: slots.length,
    filledSlots,
    articleSlots,
    emptySlots: slots.length - filledSlots,
  };
}
