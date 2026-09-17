import { createRoute } from 'honox/factory'

export default createRoute((c) => {
  return c.render(
    <main class="mx-auto min-h-screen w-full max-w-4xl px-5 py-6 sm:px-8">
      <title>自分の予定 - Reray</title>
      <header class="mb-10 flex items-center justify-between border-b border-(--color-border) pb-5">
        <a href="/" class="text-lg font-semibold tracking-tight">Reray</a>
      </header>
      <section class="rounded-md border border-(--color-border) bg-(--color-surface) p-6">
        <p class="text-sm font-semibold text-(--color-accent)">My Schedule</p>
        <h1 class="mt-3 text-3xl font-semibold tracking-tight">自分の予定</h1>
        <p class="mt-4 leading-8 text-(--color-muted)">Firebase 認証の接続後、自分が担当している枠をここに表示します。</p>
      </section>
    </main>,
  )
})
