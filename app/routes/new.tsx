import { createRoute } from 'honox/factory'

export const POST = createRoute((c) => {
  return c.json(
    {
      error: 'authentication_required',
      message: 'Calendar creation will be enabled after Firebase Authentication is connected.',
    },
    401,
  )
})

export default createRoute((c) => {
  return c.render(
    <main class="mx-auto min-h-screen w-full max-w-4xl px-5 py-6 sm:px-8">
      <title>リレー作成 - Reray</title>
      <header class="mb-10 flex items-center justify-between border-b border-(--color-border) pb-5">
        <a href="/" class="text-lg font-semibold tracking-tight">Reray</a>
      </header>

      <section class="grid gap-8 sm:grid-cols-[14rem_1fr">
        <div>
          <p class="text-sm font-semibold text-(--color-accent)">Create Relay</p>
          <h1 class="mt-3 text-3xl font-semibold tracking-tight">記事リレーを作成</h1>
          <p class="mt-4 text-sm leading-6 text-(--color-muted)">テーマと期間を決めると、投稿枠を自動生成します。</p>
        </div>

        <form method="post" class="grid gap-6 rounded-md border border-(--color-border) bg-(--color-surface) p-5 sm:p-6">
          <label class="grid gap-2">
            <span class="text-sm font-semibold">タイトル</span>
            <input class="rounded-md border border-(--color-border-strong) bg-white px-3 py-3 outline-none focus:border-(--color-text)" name="title" required maxlength={120} placeholder="Flutter を30日間語る" />
          </label>

          <label class="grid gap-2">
            <span class="text-sm font-semibold">説明</span>
            <textarea class="min-h-28 rounded-md border border-(--color-border-strong) bg-white px-3 py-3 leading-7 outline-none focus:border-(--color-text)" name="description" placeholder="テーマや参加条件を書いてください" />
          </label>

          <div class="grid gap-4 sm:grid-cols-2">
            <label class="grid gap-2">
              <span class="text-sm font-semibold">開始日</span>
              <input class="rounded-md border border-(--color-border-strong) bg-white px-3 py-3 outline-none focus:border-(--color-text)" type="date" name="startDate" required />
            </label>
            <label class="grid gap-2">
              <span class="text-sm font-semibold">終了日</span>
              <input class="rounded-md border border-(--color-border-strong) bg-white px-3 py-3 outline-none focus:border-(--color-text)" type="date" name="endDate" required />
            </label>
          </div>

          <fieldset class="grid gap-3 border-t border-(--color-border) pt-5">
            <legend class="text-sm font-semibold">枠の生成</legend>
            <label class="flex items-center gap-3 text-sm">
              <input class="accent-(--color-accent)" type="radio" name="frequency" value="daily" checked />
              <span>毎日</span>
            </label>
            <label class="flex items-center gap-3 text-sm">
              <input class="accent-(--color-accent)" type="radio" name="frequency" value="weekdays" />
              <span>平日のみ</span>
            </label>
          </fieldset>

          <button class="rounded-md bg-(--color-text) px-5 py-3 font-semibold text-white hover:bg-black" type="submit">作成する</button>
        </form>
      </section>
    </main>,
  )
})
