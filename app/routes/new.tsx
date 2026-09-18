import { createRoute } from 'honox/factory'
import type { PublicFirebaseConfig } from '../application/auth/firebaseConfig'
import { getPublicFirebaseConfig } from '../application/auth/firebaseConfig'
import { createCalendar } from '../application/calendar/createCalendar'
import AuthStatus from '../islands/auth-status'
import { requireCurrentUser } from '../infrastructure/auth/currentUser'
import { createDrizzleCalendarRepository } from '../infrastructure/calendar/repositories/drizzleCalendarRepository'
import { redirectBackWithError } from '../infrastructure/http/redirectBackWithError'
import { createDb } from '../infrastructure/providers/db/client'

export const POST = createRoute(async (c) => {
  if (!c.env.DB) {
    return c.json({ error: 'database_not_configured' }, 500)
  }

  try {
    const user = await requireCurrentUser(c)
    const body = await c.req.parseBody()
    const result = await createCalendar(createDrizzleCalendarRepository(createDb(c.env.DB)), {
      ownerId: user.id,
      title: String(body.title ?? ''),
      description: String(body.description ?? ''),
      startDate: String(body.startDate ?? ''),
      endDate: String(body.endDate ?? ''),
      frequency: body.frequency === 'weekdays' ? 'weekdays' : 'daily',
      visibility: String(body.visibility ?? ''),
      tags: String(body.tags ?? ''),
    })

    return c.redirect(`/c/${result.slug}`)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Calendar creation failed'
    return redirectBackWithError(c.req.url, c.req.header('referer'), 'create_error', message)
  }
})

export default createRoute((c) => {
  const firebaseConfig = getPublicFirebaseConfig(c.env)
  const createError = c.req.query('create_error')

  return c.render(<NewCalendarPage createError={createError} firebaseConfig={firebaseConfig} />)
})

function NewCalendarPage({ createError, firebaseConfig }: { createError: string | undefined; firebaseConfig: PublicFirebaseConfig | null }) {
  return (
    <main class="mx-auto min-h-screen w-full max-w-5xl px-5 py-6 sm:px-8">
      <title>リレー作成 - Reray</title>
      <PageHeader firebaseConfig={firebaseConfig} />
      {createError ? <ErrorMessage message={translateCreateError(createError)} /> : null}
      <CreateCalendarSection />
    </main>
  )
}

function PageHeader({ firebaseConfig }: { firebaseConfig: PublicFirebaseConfig | null }) {
  return (
    <header class="mb-12 flex flex-col gap-4 border-b border-(--color-text) pb-5 sm:flex-row sm:items-center sm:justify-between">
      <a href="/" class="reray-wordmark text-xl font-semibold tracking-tight">Reray</a>
      <AuthStatus config={firebaseConfig} />
    </header>
  )
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div class="mb-8 border border-(--color-red) px-4 py-3 text-sm font-semibold text-(--color-red)">
      {message}
    </div>
  )
}

function CreateCalendarSection() {
  return (
    <section class="grid gap-10">
      <div class="flex items-baseline">
        <span class="text-6xl font-light leading-none text-(--color-accent)">01 /</span>
        <span class="mt-2 text-sm italic text-(--color-muted)">Create Relay</span>
      </div>
      <CreateCalendarForm />
    </section>
  )
}

function CreateCalendarForm() {
  return (
    <form method="post" class="grid gap-6 border-t border-(--color-border) pt-6">
      <div>
        <div class="bg-(--color-text) px-4 py-3 text-xl font-semibold tracking-tight text-(--color-page)">記事リレーを作成</div>
        <p class="mt-5 max-w-xl text-sm leading-7 text-(--color-muted)">テーマと期間を決めると、投稿枠を自動生成します。</p>
        <div class="reray-rule mt-6" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
      </div>
      <CalendarBasicsFields />
      <VisibilityFields />
      <ScheduleFields />
      <FrequencyFields />
      <button class="bg-(--color-text) px-5 py-3 font-semibold text-(--color-page) hover:bg-(--color-accent-hover)" type="submit">作成する</button>
    </form>
  )
}

function CalendarBasicsFields() {
  return (
    <>
      <label class="grid gap-2">
        <span class="text-sm font-semibold">タイトル</span>
        <input class="reray-input px-3 py-3" name="title" required maxlength={120} placeholder="Flutter を30日間語る" />
      </label>
      <label class="grid gap-2">
        <span class="text-sm font-semibold">説明</span>
        <textarea class="reray-input min-h-28 px-3 py-3 leading-7" name="description" placeholder="テーマや参加条件を書いてください" />
      </label>
      <label class="grid gap-2">
        <span class="text-sm font-semibold">タグ</span>
        <input class="reray-input px-3 py-3" name="tags" maxlength={200} placeholder="flutter, zenn, advent calendar" />
        <span class="text-xs text-(--color-muted)">カンマ区切りで最大8個まで設定できます。</span>
      </label>
    </>
  )
}

function VisibilityFields() {
  return (
    <fieldset class="grid gap-3 border-t border-(--color-border) pt-5">
      <legend class="text-sm font-semibold">公開範囲</legend>
      <RadioOption name="visibility" value="public" title="公開" description="トップページの開催中リレーに表示します。" checked />
      <RadioOption name="visibility" value="private" title="限定共有" description="一覧には表示せず、URLを知っている人だけ見られます。" />
    </fieldset>
  )
}

function ScheduleFields() {
  return (
    <div class="grid gap-4 sm:grid-cols-2">
      <label class="grid gap-2">
        <span class="text-sm font-semibold">開始日</span>
        <input class="reray-input px-3 py-3" type="date" name="startDate" required />
      </label>
      <label class="grid gap-2">
        <span class="text-sm font-semibold">終了日</span>
        <input class="reray-input px-3 py-3" type="date" name="endDate" required />
      </label>
    </div>
  )
}

function FrequencyFields() {
  return (
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
  )
}

function RadioOption({ name, value, title, description, checked = false }: { name: string; value: string; title: string; description: string; checked?: boolean }) {
  return (
    <label class="flex items-start gap-3 text-sm">
      <input class="mt-1 accent-(--color-accent)" type="radio" name={name} value={value} checked={checked} />
      <span>
        <span class="block font-semibold">{title}</span>
        <span class="block text-(--color-muted)">{description}</span>
      </span>
    </label>
  )
}

function translateCreateError(message: string) {
  if (message === 'Authentication required') {
    return 'ログイン後にリレーを作成してください。'
  }

  if (message === 'Invalid date range') {
    return '開始日と終了日を確認してください。'
  }

  if (message === 'No slots generated') {
    return '指定された期間では枠を作成できませんでした。'
  }

  if (message === 'Title is required') {
    return 'タイトルを入力してください。'
  }

  if (message.startsWith('Tag must be')) {
    return 'タグは1つ24文字以内で入力してください。'
  }

  return 'リレーの作成に失敗しました。期間を短くするか、もう一度試してください。'
}
