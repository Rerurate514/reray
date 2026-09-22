import type { Child } from 'hono/jsx'
import type { PublicFirebaseConfig } from '../../../application/auth/firebaseConfig'
import AuthStatus from '../../../islands/auth-status'

export function PageHeader({
  actions,
  firebaseConfig,
}: {
  actions?: Child
  firebaseConfig: PublicFirebaseConfig | null
}) {
  return (
    <header class="mb-12 flex flex-col gap-4 border-b border-(--color-text) pb-5 sm:flex-row sm:items-center sm:justify-between">
      <a href="/" class="reray-wordmark text-xl font-semibold tracking-tight">Reray</a>
      {actions ? (
        <div class="flex flex-wrap items-center gap-2">
          {actions}
          <AuthStatus config={firebaseConfig} />
        </div>
      ) : (
        <AuthStatus config={firebaseConfig} />
      )}
    </header>
  )
}
