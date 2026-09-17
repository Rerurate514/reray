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
    <main class="mx-auto min-h-screen w-full max-w-3xl px-5 py-8 sm:px-8">
      <title>リレー作成 - Reray</title>
      <header class="mb-10 flex items-center justify-between">
        <a href="/" class="text-xl font-bold">Reray</a>
      </header>

      <section class="rounded-lg bg-white p-6 shadow-sm sm:p-8">
        <p class="text-sm font-semibold text-[#b3532a]">Create Relay</p>
        <h1 class="mt-2 text-3xl font-bold">記事リレーを作成</h1>

        <form method="post" class="mt-8 grid gap-5">
          <label class="grid gap-2">
            <span class="text-sm font-semibold">タイトル</span>
            <input class="rounded-md border border-[#cfc6ba] px-3 py-3" name="title" required maxlength={120} placeholder="Flutter を30日間語る" />
          </label>

          <label class="grid gap-2">
            <span class="text-sm font-semibold">説明</span>
            <textarea class="min-h-28 rounded-md border border-[#cfc6ba] px-3 py-3" name="description" placeholder="テーマや参加条件を書いてください" />
          </label>

          <div class="grid gap-4 sm:grid-cols-2">
            <label class="grid gap-2">
              <span class="text-sm font-semibold">開始日</span>
              <input class="rounded-md border border-[#cfc6ba] px-3 py-3" type="date" name="startDate" required />
            </label>
            <label class="grid gap-2">
              <span class="text-sm font-semibold">終了日</span>
              <input class="rounded-md border border-[#cfc6ba] px-3 py-3" type="date" name="endDate" required />
            </label>
          </div>

          <fieldset class="grid gap-3">
            <legend class="text-sm font-semibold">枠の生成</legend>
            <label class="flex items-center gap-2">
              <input type="radio" name="frequency" value="daily" checked />
              <span>毎日</span>
            </label>
            <label class="flex items-center gap-2">
              <input type="radio" name="frequency" value="weekdays" />
              <span>平日のみ</span>
            </label>
          </fieldset>

          <button class="mt-3 rounded-md bg-[#1f2933] px-5 py-3 font-semibold text-white" type="submit">作成する</button>
        </form>
      </section>
    </main>,
  )
})
