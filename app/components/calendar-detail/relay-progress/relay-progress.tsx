import type { RelayProgress as RelayProgressStats } from "../../../application/calendar/services/buildRelayProgress";

export function RelayProgress({ progress }: { progress: RelayProgressStats }) {
  const { articleSlots, emptySlots, filledSlots, totalSlots } = progress;

  if (totalSlots === 0) {
    return null;
  }

  const articlePercent = Math.round((articleSlots / totalSlots) * 100);
  const filledPercent = Math.round((filledSlots / totalSlots) * 100);
  const joinedOnlySlots = Math.max(0, filledSlots - articleSlots);
  const isComplete = articleSlots === totalSlots;

  return (
    <section class="mt-8 border border-(--color-border)">
      <div class="flex flex-wrap items-baseline justify-between gap-2 border-b border-(--color-border) px-4 py-3">
        <p class="text-xs font-semibold uppercase text-(--color-subtle)">
          Relay progress
        </p>
        <p class="text-sm font-semibold">
          {isComplete ? "リレー完走" : `${articleSlots} / ${totalSlots} 枠`}
        </p>
      </div>
      <div class="px-4 py-4">
        <p class="flex items-baseline gap-1">
          <span class="text-3xl font-medium tabular-nums">
            {articlePercent}
          </span>
          <span class="text-sm font-semibold text-(--color-muted)">%</span>
          <span class="ml-2 text-xs text-(--color-muted)">
            の枠で記事がつながっています
          </span>
        </p>
        <div class="relative mt-3 h-2 w-full bg-(--color-surface-muted)">
          <div
            class="absolute inset-y-0 left-0 bg-(--color-border-strong)"
            style={`width: ${filledPercent}%`}
          ></div>
          <div
            class="absolute inset-y-0 left-0 bg-(--color-accent)"
            style={`width: ${articlePercent}%`}
          ></div>
        </div>
        <ul class="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-(--color-muted)">
          <li class="flex items-center gap-1.5">
            <span class="h-2 w-2 bg-(--color-accent)" aria-hidden="true"></span>
            記事あり {articleSlots}
          </li>
          <li class="flex items-center gap-1.5">
            <span
              class="h-2 w-2 bg-(--color-border-strong)"
              aria-hidden="true"
            ></span>
            参加のみ {joinedOnlySlots}
          </li>
          <li class="flex items-center gap-1.5">
            <span
              class="h-2 w-2 border border-(--color-border) bg-(--color-page)"
              aria-hidden="true"
            ></span>
            空き {emptySlots}
          </li>
        </ul>
      </div>
    </section>
  );
}
