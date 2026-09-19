import type { PublicFirebaseConfig } from '../../../application/auth/firebaseConfig'
import { FeedbackMessage } from '../../shared/feedback-message/index'
import { Footer } from '../../shared/footer/index'
import { PageHeader } from '../../shared/page-header/index'
import { CreateCalendarSection } from '../create-calendar-section/index'
import { translateCreateError } from '../translate-create-error/index'

export function NewCalendarPage({
  createError,
  firebaseConfig,
}: {
  createError: string | undefined
  firebaseConfig: PublicFirebaseConfig | null
}) {
  return (
    <main class="mx-auto min-h-screen w-full max-w-5xl px-5 py-6 sm:px-8">
      <title>リレー作成 - Reray</title>
      <PageHeader firebaseConfig={firebaseConfig} />
      {createError ? <FeedbackMessage tone="error">{translateCreateError(createError)}</FeedbackMessage> : null}
      <CreateCalendarSection />
      <Footer />
    </main>
  )
}
