export type RelayBatonAuthor = {
  username: string | null;
  displayName: string | null;
  avatarUrl: string | null;
};

export type RelayBatonLink = {
  slotId: string;
  position: number;
  scheduledDate: string | null;
  articleTitle: string | null;
  articleUrl: string | null;
  author: RelayBatonAuthor | null;
};

export type RelayBaton = {
  previous: RelayBatonLink | null;
  next: RelayBatonLink | null;
};
