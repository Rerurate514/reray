export function GettingStartedPanel() {
  return (
    <div class="mt-8 border border-(--color-border) bg-[#fff8ed] p-5">
      <p class="text-xs font-semibold uppercase text-(--color-accent)">First step</p>
      <h2 class="mt-2 text-2xl font-semibold tracking-tight">まだ予定はありません</h2>
      <p class="mt-3 max-w-2xl text-sm leading-7 text-(--color-muted)">
        新しいリレーを作るか、公開中のリレーに参加すると、このページに管理項目が並びます。
        担当枠の記事タイトルやURLもここから更新できます。
      </p>
      <div class="mt-5 flex flex-wrap gap-3">
        <a class="bg-(--color-text) px-5 py-3 text-sm font-semibold text-(--color-page) hover:bg-(--color-accent-hover)" href="/new">
          リレーを作る
        </a>
        <a class="border border-(--color-border-strong) px-5 py-3 text-sm font-semibold hover:border-(--color-accent) hover:text-(--color-accent)" href="/">
          公開リレーを見る
        </a>
      </div>
    </div>
  )
}
