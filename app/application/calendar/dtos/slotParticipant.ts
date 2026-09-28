export type SlotParticipant = {
  entryId: string
  userId: string | null
  username: string | null
  displayName: string | null
  avatarUrl: string | null
  description: string | null
  articleTitle: string | null
  articleUrl: string | null
}

export function isActiveParticipant(participant: SlotParticipant) {
  return participant.userId !== null
}

export function countActiveParticipants(participants: SlotParticipant[]) {
  return participants.filter(isActiveParticipant).length
}
