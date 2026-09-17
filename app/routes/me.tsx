import { createRoute } from 'honox/factory'

export default createRoute((c) => {
  return c.render(
    <main class="mx-auto min-h-screen w-full max-w-5xl px-5 py-6 sm:px-8">
      <title>自分の予定 - Reray</title>
      <header class="mb-12 flex items-center justify-between border-b border-(--color-text) pb-5">
        <a href="/" class="reray-wordmark text-xl font-semibold tracking-tight">Reray</a>
      </header>
      <section class="grid gap-10 sm:grid-cols-[12rem_1fr">
        <div>
          <p class="text-6xl font-light leading-none text-(--color-accent)">01 /</p>
          <p class="mt-2 text-sm italic text-(--color-muted)">My Schedule</p>
        </div>
        <div class="border-t border-(--color-border) pt-6">
          <div class="bg-(--color-text) px-4 py-3 text-xl font-semibold tracking-tight text-(--color-page)">自分の予定</div>
          <p class="mt-5 max-w-2xl leading-8 text-(--color-muted)">Firebase 認証の接続後、自分が担当している枠をここに表示します。</p>
          <div class="reray-rule mt-8" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
        </div>
      </section>
    </main>,
  )
})
