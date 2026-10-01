import type { RelayBaton, RelayBatonLink } from "../dtos/relayBaton";

export type RelayBatonSlot = {
  id: string;
  position: number;
  scheduledDate: string | null;
  participants: Array<{
    username: string | null;
    displayName: string | null;
    avatarUrl: string | null;
    articleTitle: string | null;
    articleUrl: string | null;
  }>;
};

/**
 * 指定した枠の前後にある「記事が登録済みの枠」からバトンを取り出す。
 *
 * `links` は position の昇順で渡す。同じ position が複数ある場合は、先頭の
 * 要素（＝先に登録された記事）を代表として選ぶ。position が前後しない枠は
 * 対象外になるため、空き枠を飛ばして次の記事へつながる。
 */
export function buildRelayBaton(
  links: RelayBatonLink[],
  position: number,
): RelayBaton {
  let previous: RelayBatonLink | null = null;
  let next: RelayBatonLink | null = null;

  for (const link of links) {
    if (link.position < position) {
      if (previous === null || link.position > previous.position) {
        previous = link;
      }
      continue;
    }

    if (link.position > position) {
      if (next === null || link.position < next.position) {
        next = link;
      }
    }
  }

  return { previous, next };
}

/**
 * 枠一覧から、各枠のバトンをまとめて組み立てる。カレンダー詳細のように
 * 全枠をまとめて描画する画面で使う。
 */
export function buildRelayBatons(
  slots: RelayBatonSlot[],
): Map<string, RelayBaton> {
  const links = slots.flatMap((slot) =>
    slot.participants
      .filter((participant) => participant.articleUrl !== null)
      .map((participant) => ({
        slotId: slot.id,
        position: slot.position,
        scheduledDate: slot.scheduledDate,
        articleTitle: participant.articleTitle,
        articleUrl: participant.articleUrl,
        author: {
          username: participant.username,
          displayName: participant.displayName,
          avatarUrl: participant.avatarUrl,
        },
      })),
  );

  return new Map(
    slots.map((slot) => [slot.id, buildRelayBaton(links, slot.position)]),
  );
}
