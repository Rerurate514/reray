import { useEffect, useMemo, useState } from 'hono/jsx'
import { getApps, initializeApp, type FirebaseOptions } from 'firebase/app'
import { GithubAuthProvider, GoogleAuthProvider, getAuth, onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth'
import type { PublicFirebaseConfig } from '../application/auth/firebaseConfig'

type Props = {
  config: PublicFirebaseConfig | null
}

type SessionUser = {
  username: string
  displayName: string
  avatarUrl: string | null
}

export default function AuthStatus({ config }: Props) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null)
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const auth = useMemo(() => {
    if (!config || typeof window === 'undefined') {
      return null
    }

    const app = getApps()[0] ?? initializeApp(config as FirebaseOptions)
    return getAuth(app)
  }, [config])

  useEffect(() => {
    if (!auth) {
      return
    }

    return onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user)
      if (!user) {
        setSessionUser(null)
        return
      }

      const idToken = await user.getIdToken()
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      })

      const response = await fetch('/api/auth/me')
      const body = await response.json<{ user: SessionUser | null }>()
      setSessionUser(body.user)
    })
  }, [auth])

  if (!config || !auth) {
    return <span class="text-xs text-(--color-subtle)">ログイン設定が未完了です</span>
  }

  async function login(providerName: 'google' | 'github') {
    if (!auth) {
      return
    }

    setStatus('loading')
    try {
      const provider = providerName === 'google' ? new GoogleAuthProvider() : new GithubAuthProvider()
      await signInWithPopup(auth, provider)
      setStatus('idle')
    } catch {
      setStatus('error')
    }
  }

  async function logout() {
    if (!auth) {
      return
    }

    setStatus('loading')
    await signOut(auth)
    await fetch('/api/auth/session', { method: 'DELETE' })
    setSessionUser(null)
    setStatus('idle')
  }

  if (firebaseUser) {
    const avatarUrl = sessionUser?.avatarUrl ?? firebaseUser.photoURL
    const displayName = sessionUser?.displayName ?? firebaseUser.displayName ?? sessionUser?.username ?? 'signed_in'

    return (
      <div class="flex items-center gap-3">
        {avatarUrl ? (
          <img class="h-7 w-7 rounded-full border border-(--color-border-strong) object-cover" src={avatarUrl} alt={displayName} />
        ) : (
          <span class="grid h-7 w-7 place-items-center rounded-full border border-(--color-border-strong) text-xs font-semibold text-(--color-muted)">{displayName.slice(0, 1)}</span>
        )}
        <span class="hidden text-sm text-(--color-muted) sm:inline">
          @{sessionUser?.username ?? displayName}
        </span>
        <button class="border border-(--color-border) px-3 py-2 text-sm text-(--color-muted) hover:border-(--color-accent) hover:text-(--color-text)" type="button" onClick={logout}>
          ログアウト
        </button>
      </div>
    )
  }

  return (
    <div class="flex items-center gap-2">
      <span class="hidden text-sm text-(--color-muted) sm:inline">ログイン</span>
      <button class="bg-(--color-text) px-3 py-2 text-sm font-semibold text-(--color-page) hover:bg-(--color-accent-hover) disabled:opacity-60" type="button" disabled={status === 'loading'} onClick={() => login('google')} aria-label="Googleでログイン">
        Google
      </button>
      <button class="border border-(--color-border) px-3 py-2 text-sm text-(--color-muted) hover:border-(--color-accent) hover:text-(--color-text) disabled:opacity-60" type="button" disabled={status === 'loading'} onClick={() => login('github')} aria-label="GitHubでログイン">
        GitHub
      </button>
      {status === 'loading' ? <span class="text-xs text-(--color-subtle)">処理中...</span> : null}
      {status === 'error' ? <span class="text-xs text-(--color-accent)">ログインに失敗しました</span> : null}
    </div>
  )
}
