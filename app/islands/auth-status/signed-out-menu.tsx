import { MenuButton, MenuLink, MenuShell } from './menu'
import type { AuthProviderName } from './auth-providers'

export function SignedOutMenu({
  errorMessage,
  onLogin,
  status,
}: {
  errorMessage: string | null
  onLogin: (providerName: AuthProviderName) => void
  status: 'idle' | 'loading' | 'error'
}) {
  return (
    <MenuShell>
      <MenuButton icon="G" label="Google でログイン" loading={status === 'loading'} onClick={() => onLogin('google')} />
      <MenuButton icon="◖" label="GitHub でログイン" loading={status === 'loading'} onClick={() => onLogin('github')} />
      <MenuButton icon="𝕏" label="X でログイン" loading={status === 'loading'} onClick={() => onLogin('twitter')} />
      <div class="my-1 border-t border-(--color-border)" />
      <MenuLink href="/" icon="◴" label="過去のカレンダー" />
      <MenuLink href="/" icon="？" label="ヘルプ" />
      {status === 'loading' ? <p class="px-3 pb-3 text-xs text-(--color-subtle)">処理中...</p> : null}
      {status === 'error' ? <p class="px-3 pb-3 text-xs leading-5 text-(--color-accent)">{errorMessage ?? 'ログインに失敗しました'}</p> : null}
    </MenuShell>
  )
}
