import type { Child } from 'hono/jsx'
import type { PublicFirebaseConfig } from '../../../application/auth/firebaseConfig'
import type { SlotDetail } from '../../../application/calendar/dtos/slotDetail'
import { countActiveParticipants } from '../../../application/calendar/dtos/slotParticipant'
import type { AuthenticatedUser } from '../../../domain/user/entities/user'
import JoinSlotButton from '../../../islands/join-slot-button'
import MySlotArticleForm from '../../../islands/my-slot-article-form'
import SlotShareCard from '../../../islands/slot-share-card'
import { ParticipantEntry } from '../../calendar-detail/participant-entry'
import { translateCalendarActionError } from '../../calendar-detail/translate-calendar-action-error'
import { FeedbackMessage } from '../../shared/feedback-message'
import { Footer } from '../../shared/footer'
import { PageHeader } from '../../shared/page-header'

export function SlotDetailPage({
  articleError,
  currentUser,
  descriptionError,
  descriptionSaved,
  detail,
  firebaseConfig,
  slotError,
}: {
  articleError: string | undefined
  currentUser: AuthenticatedUser | null
  descriptionError: string | undefined
  descriptionSaved: string | undefined
  detail: SlotDetail
  firebaseConfig: PublicFirebaseConfig | null
  slotError: string | undefined
}) {
  const { calendar, slot } = detail
  const slotLabel = slot.scheduledDate ?? `#${slot.position}`
  const isCalendarOwner = currentUser?.id === calendar.ownerId
  const ownEntry = currentUser ? slot.participants.find((entry) => entry.userId === currentUser.id) ?? null : null
  const activeParticipantCount = countActiveParticipants(slot.participants)
  const isFull = activeParticipantCount >= calendar.capacity
  const error = slotError ?? articleError ?? descriptionError

  return (
    <main class="mx-auto min-h-screen w-full max-w-5xl px-5 py-6 sm:px-8">
      <PageHeader actions={<HeaderActions calendarSlug={calendar.slug} />} firebaseConfig={firebaseConfig} />
      {error ? <FeedbackMessage tone="error">{translateCalendarActionError(error)}</FeedbackMessage> : null}
      {descriptionSaved ? <FeedbackMessage tone="success">告知文を保存しました。</FeedbackMessage> : null}

      <section class="grid gap-8">
        <div class="border-b border-(--color-text) pb-8">
          <p class="text-sm font-semibold text-(--color-muted)">
            <a class="text-(--color-accent) hover:text-(--color-accent-hover)" href={`/c/${calendar.slug}`}>{calendar.title}</a>
            <span class="mx-2">/</span>
            {slotLabel}
          </p>
          <h1 class="mt-5 text-4xl font-medium leading-tight tracking-tight sm:text-6xl">{slotLabel}</h1>
          <p class="mt-4 text-(--color-muted)">この枠の担当、告知文、記事を管理できます。定員 {calendar.capacity} 名 / 現在 {activeParticipantCount} 名。</p>
        </div>

        <Panel title="担当">
          {slot.participants.length > 0 ? (
            <div class="grid gap-4">
              {slot.participants.map((entry) => (
                <ParticipantEntry
                  calendarSlug={calendar.slug}
                  canRemove={isCalendarOwner && entry.userId !== currentUser?.id}
                  entry={entry}
                  isCurrentUser={currentUser !== null && entry.userId === currentUser.id}
                  showEditLink={false}
                  slotId={slot.id}
                />
              ))}
            </div>
          ) : (
            <p class="text-(--color-muted)">この枠はまだ空いています。</p>
          )}
          <div class="grid gap-3 border-t border-(--color-border) pt-4">
            {ownEntry ? (
              <CancelSlotButton slotId={slot.id} />
            ) : currentUser && !isFull ? (
              <JoinSlotForm slotId={slot.id} />
            ) : (
              <p class="text-sm font-semibold text-(--color-muted)">{isFull ? 'この枠は満員です。' : 'ログイン後に参加できます。'}</p>
            )}
          </div>
        </Panel>

        <Panel title="告知文">
          {ownEntry?.description ? (
            <p class="whitespace-pre-wrap leading-8 text-(--color-muted)">{ownEntry.description}</p>
          ) : (
            <p class="text-(--color-muted)">{ownEntry ? 'まだ告知文はありません。' : '参加すると告知文を登録できます。'}</p>
          )}
          {ownEntry ? <SlotNoticeForm description={ownEntry.description ?? ''} slotId={slot.id} /> : null}
        </Panel>

        {ownEntry ? (
          <Panel title="記事を入力">
            <MySlotArticleForm action={`/api/slots/${slot.id}/article`} articleTitle={ownEntry.articleTitle ?? ''} articleUrl={ownEntry.articleUrl ?? ''} />
          </Panel>
        ) : null}

        <SlotShareCard calendarTitle={calendar.title} isRegistered={activeParticipantCount > 0} slotLabel={slotLabel} slotUrl={`/c/${calendar.slug}/slots/${slot.id}`} />
      </section>
      <Footer />
    </main>
  )
}

function HeaderActions({ calendarSlug }: { calendarSlug: string }) {
  return <a class="border border-(--color-border-strong) px-3 py-2 text-sm font-semibold hover:border-(--color-accent) hover:text-(--color-accent)" href={`/c/${calendarSlug}`}>カレンダーへ</a>
}

function Panel({ children, title }: { children: Child; title: string }) {
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

function JoinSlotForm({ slotId }: { slotId: string }) {
  return (
    <JoinSlotButton className="w-full max-w-full border border-(--color-accent) px-4 py-3 text-sm font-semibold text-(--color-accent) hover:bg-[#fff3ed] disabled:opacity-60" label="この枠に参加する" slotId={slotId} />
  )
}

function CancelSlotButton({ slotId }: { slotId: string }) {
  return (
    <form method="post" action={`/api/slots/${slotId}/cancel`}>
      <button class="w-full max-w-full border border-(--color-border-strong) px-4 py-3 text-sm font-semibold hover:border-(--color-accent) hover:text-(--color-accent)" type="submit">参加をキャンセル</button>
    </form>
  )
}
