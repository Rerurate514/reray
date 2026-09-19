export function SignedOutState() {
  return (
    <div class="mt-6 border-y border-dashed border-(--color-border-strong) py-8">
      <h2 class="text-2xl font-semibold tracking-tight">ログインすると予定を管理できます</h2>
      <p class="mt-4 max-w-2xl text-sm leading-7 text-(--color-muted)">
        作成したリレー、参加している枠、登録した記事URLをここにまとめて表示します。
        右上のメニューからログインしてください。
      </p>
      <div class="mt-6 flex flex-wrap gap-3">
        <a class="bg-(--color-text) px-5 py-3 text-sm font-semibold text-(--color-page) hover:bg-(--color-accent-hover)" href="/">
          公開リレーを見る
        </a>
        <a class="border border-(--color-border-strong) px-5 py-3 text-sm font-semibold hover:border-(--color-accent) hover:text-(--color-accent)" href="/new">
          リレーを作る
        </a>
      </div>
    </div>
  )
}
