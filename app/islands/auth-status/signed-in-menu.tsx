import type { User } from 'firebase/auth'
import { MenuLink, MenuShell, SignedInTrigger } from './menu'
import type { SessionUser } from './auth-status'

export function SignedInMenu({
  firebaseUser,
  onLogout,
  sessionUser,
  status,
}: {
  firebaseUser: User
  onLogout: () => void
  sessionUser: SessionUser | null
  status: 'idle' | 'loading' | 'error'
}) {
  const avatarUrl = sessionUser?.avatarUrl ?? firebaseUser.photoURL
  const displayName = sessionUser?.displayName ?? firebaseUser.displayName ?? sessionUser?.username ?? 'signed_in'
  const username = sessionUser?.username ?? displayName

  return (
    <MenuShell trigger={<SignedInTrigger avatarUrl={avatarUrl} displayName={displayName} username={username} />}>
      <div class="flex items-center gap-2 border-b border-(--color-border) px-3 py-3">
        {avatarUrl ? (
          <img class="h-7 w-7 rounded-full border border-(--color-border-strong) object-cover" src={avatarUrl} alt={displayName} />
        ) : (
          <span class="grid h-7 w-7 place-items-center rounded-full border border-(--color-border-strong) text-xs font-semibold text-(--color-muted)">{displayName.slice(0, 1)}</span>
        )}
        <span class="min-w-0 truncate text-sm font-semibold">@{username}</span>
      </div>
      <MenuLink href="/me" icon="◎" label="自分の予定" />
      <MenuLink href="/new" icon="＋" label="リレーを作る" />
      <button class="flex w-full items-center gap-3 border-t border-(--color-border) px-3 py-3 text-left text-sm text-(--color-muted) hover:bg-(--color-surface-muted) hover:text-(--color-text) disabled:opacity-60" type="button" disabled={status === 'loading'} onClick={onLogout}>
        <span class="w-5 text-center text-base">↪</span>
        <span>ログアウト</span>
      </button>
    </MenuShell>
  )
}
