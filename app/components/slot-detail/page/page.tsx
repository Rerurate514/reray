import type { PublicFirebaseConfig } from '../../../application/auth/firebaseConfig'
import type { SlotDetail } from '../../../application/calendar/dtos/slotDetail'
import type { AuthenticatedUser } from '../../../domain/user/entities/user'
import MySlotArticleForm from '../../../islands/my-slot-article-form/my-slot-article-form'
import SlotShare from '../../../islands/slot-share/slot-share'
import { FeedbackMessage } from '../../shared/feedback-message'
import { Footer } from '../../shared/footer'
import { PageHeader } from '../../shared/page-header'
import { translateCalendarActionError } from '../../calendar-detail/translate-calendar-action-error'

export function SlotDetailPage({
  articleError,
  currentUser,
  descriptionError,
  descriptionSaved,
  detail,
  firebaseConfig,
  slotError,
  urlError,
  urlSaved,
}: {
  articleError: string | undefined
  currentUser: AuthenticatedUser | null
  descriptionError: string | undefined
  descriptionSaved: string | undefined
  detail: SlotDetail
  firebaseConfig: PublicFirebaseConfig | null
  slotError: string | undefined
  urlError: string | undefined
  urlSaved: string | undefined
}) {
  const { calendar, slot } = detail
  const slotLabel = slot.scheduledDate ?? `#${slot.position}`
  const isAssignedUser = currentUser?.id === slot.userId
  const isCalendarOwner = currentUser?.id === calendar.ownerId
  const canEditNotice = isAssignedUser || isCalendarOwner
  const error = slotError ?? articleError ?? descriptionError ?? urlError

  return (
    <main class="mx-auto min-h-screen w-full max-w-5xl px-5 py-6 sm:px-8">
      <PageHeader actions={<HeaderActions calendarSlug={calendar.slug} />} firebaseConfig={firebaseConfig} />
      {error ? <FeedbackMessage tone="error">{translateCalendarActionError(error)}</FeedbackMessage> : null}
      {descriptionSaved ? <FeedbackMessage tone="success">告知文を保存しました。</FeedbackMessage> : null}
      {urlSaved ? <FeedbackMessage tone="success">URLを保存しました。</FeedbackMessage> : null}

      <section class="grid gap-8">
        <div class="border-b border-(--color-text) pb-8">
          <p class="text-sm font-semibold text-(--color-muted)">
            <a class="text-(--color-accent) hover:text-(--color-accent-hover)" href={`/c/${calendar.slug}`}>{calendar.title}</a>
            <span class="mx-2">/</span>
            {slotLabel}
          </p>
          <h1 class="mt-5 text-4xl font-medium leading-tight tracking-tight sm:text-6xl">{slotLabel}</h1>
          <p class="mt-4 text-(--color-muted)">この枠の担当、告知文、記事を管理できます。</p>
          <SlotShare calendarTitle={calendar.title} slotLabel={slotLabel} slotUrl={`/c/${calendar.slug}/slots/${slot.id}`} />
        </div>

        <div class="grid min-w-0 gap-6">
          <Panel title="担当">
            {slot.userId ? (
              <div class="flex min-w-0 flex-wrap items-center gap-4">
                <SlotUser slot={slot} />
                {isAssignedUser ? <CancelSlotButton slotId={slot.id} /> : null}
                {isCalendarOwner && !isAssignedUser ? <ClearSlotButton slotId={slot.id} /> : null}
              </div>
            ) : (
              <div class="grid gap-4">
                <p class="text-(--color-muted)">この枠はまだ空いています。</p>
                {currentUser ? <JoinSlotButton slotId={slot.id} /> : <p class="text-sm font-semibold text-(--color-muted)">ログイン後に参加できます。</p>}
              </div>
            )}
          </Panel>

          <Panel title="告知文">
            {slot.description ? (
              <p class="whitespace-pre-wrap leading-8 text-(--color-muted)">{slot.description}</p>
            ) : (
              <p class="text-(--color-muted)">まだ告知文はありません。</p>
            )}
            {canEditNotice ? <SlotNoticeForm description={slot.description ?? ''} slotId={slot.id} /> : null}
          </Panel>

          <Panel title="URL">
            {slot.url ? (
              <a class="break-all font-semibold text-(--color-accent) underline-offset-4 hover:text-(--color-accent-hover) hover:underline" href={slot.url} target="_blank" rel="noopener noreferrer">
                {slot.url}
              </a>
            ) : (
              <p class="text-(--color-muted)">まだURLは設定されていません。</p>
            )}
            {canEditNotice ? <SlotUrlForm slotId={slot.id} url={slot.url ?? ''} /> : null}
          </Panel>

          {isAssignedUser ? (
            <Panel title="記事">
              <MySlotArticleForm action={`/api/slots/${slot.id}/article`} articleTitle={slot.articleTitle ?? ''} articleUrl={slot.articleUrl ?? ''} />
            </Panel>
          ) : null}
        </div>
      </section>
      <Footer />
    </main>
  )
}

function HeaderActions({ calendarSlug }: { calendarSlug: string }) {
  return <a class="border border-(--color-border-strong) px-3 py-2 text-sm font-semibold hover:border-(--color-accent) hover:text-(--color-accent)" href={`/c/${calendarSlug}`}>カレンダーへ</a>
}

function Panel({ children, title }: { children: JSX.Element | JSX.Element[]; title: string }) {
  return (
    <section class="min-w-0 border border-(--color-border) p-5">
      <h2 class="text-lg font-semibold">{title}</h2>
      <div class="mt-4 grid min-w-0 gap-4">{children}</div>
    </section>
  )
}

function SlotNoticeForm({ description, slotId }: { description: string; slotId: string }) {
  return (
    <form method="post" action={`/api/slots/${slotId}/description`} class="grid min-w-0 gap-3 border-t border-(--color-border) pt-4">
      <textarea class="reray-input min-h-32 max-w-full px-3 py-3 leading-7" name="description" placeholder="この枠の告知文、募集内容、記事テーマなど">{description}</textarea>
      <div>
        <button class="max-w-full bg-(--color-text) px-4 py-3 text-sm font-semibold text-(--color-page) hover:bg-(--color-accent-hover)" type="submit">告知文を保存</button>
      </div>
    </form>
  )
}

function SlotUrlForm({ slotId, url }: { slotId: string; url: string }) {
  return (
    <form method="post" action={`/api/slots/${slotId}/url`} class="grid min-w-0 gap-3 border-t border-(--color-border) pt-4">
      <input class="reray-input max-w-full px-3 py-3" name="url" value={url} placeholder="https://example.com/" />
      <div>
        <button class="max-w-full bg-(--color-text) px-4 py-3 text-sm font-semibold text-(--color-page) hover:bg-(--color-accent-hover)" type="submit">URLを保存</button>
      </div>
    </form>
  )
}

function SlotUser({ slot }: { slot: SlotDetail['slot'] }) {
  const displayName = slot.displayName ?? slot.username ?? 'user'

  return (
    <div class="flex items-center gap-2">
      {slot.avatarUrl ? (
        <img class="h-8 w-8 rounded-full border border-(--color-border-strong) object-cover" src={slot.avatarUrl} alt={displayName} />
      ) : (
        <span class="grid h-8 w-8 place-items-center rounded-full border border-(--color-border-strong) text-xs font-semibold text-(--color-muted)">{displayName.slice(0, 1)}</span>
      )}
      <span class="font-semibold">{displayName}</span>
    </div>
  )
}

function JoinSlotButton({ slotId }: { slotId: string }) {
  return (
    <form method="post" action={`/api/slots/${slotId}/join`}>
      <button class="w-full max-w-full border border-(--color-accent) px-4 py-3 text-sm font-semibold text-(--color-accent) hover:bg-[#fff3ed]" type="submit">この枠に参加する</button>
    </form>
  )
}

function CancelSlotButton({ slotId }: { slotId: string }) {
  return (
    <form method="post" action={`/api/slots/${slotId}/cancel`}>
      <button class="w-full max-w-full border border-(--color-border-strong) px-4 py-3 text-sm font-semibold hover:border-(--color-accent) hover:text-(--color-accent)" type="submit">参加をキャンセル</button>
    </form>
  )
}

function ClearSlotButton({ slotId }: { slotId: string }) {
  return (
    <form method="post" action={`/api/slots/${slotId}/clear`}>
      <button class="w-full max-w-full border border-(--color-red) px-4 py-3 text-sm font-semibold text-(--color-red) hover:bg-(--color-red) hover:text-(--color-page)" type="submit">担当を外す</button>
    </form>
  )
}
