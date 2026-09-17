import { createRoute } from 'honox/factory'

export default createRoute((c) => {
  return c.render(
    <main class="mx-auto min-h-screen w-full max-w-3xl px-5 py-8 sm:px-8">
      <title>自分の予定 - Reray</title>
      <header class="mb-10 flex items-center justify-between">
        <a href="/" class="text-xl font-bold">Reray</a>
      </header>
      <section class="rounded-lg bg-white p-6 shadow-sm">
        <h1 class="text-3xl font-bold">自分の予定</h1>
        <p class="mt-4 leading-8 text-[#687583]">Firebase 認証の接続後、自分が担当している枠をここに表示します。</p>
      </section>
    </main>,
  )
})
