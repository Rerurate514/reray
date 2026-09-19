import { useEffect, useMemo, useState } from 'hono/jsx'
import { FirebaseError, getApps, initializeApp, type FirebaseOptions } from 'firebase/app'
import { getAuth, onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth'
import type { PublicFirebaseConfig } from '../../application/auth/firebaseConfig'
import { SignedInMenu } from './signed-in-menu'
import { SignedOutMenu } from './signed-out-menu'
import { createAuthProvider, type AuthProviderName } from './auth-providers'
import { translateFirebaseError } from './translate-firebase-error'

type Props = {
  config: PublicFirebaseConfig | null
}

export type SessionUser = {
  username: string
  displayName: string
  avatarUrl: string | null
}

export default function AuthStatus({ config }: Props) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null)
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
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

      try {
        await createSession(user)
      } catch (error) {
        console.error(error)
        setErrorMessage('ログイン後のセッション作成に失敗しました。')
        setStatus('error')
        return
      }

      const response = await fetch('/api/auth/me')
      const body = await response.json<{ user: SessionUser | null }>()
      setSessionUser(body.user)
    })
  }, [auth])

  if (!config || !auth) {
    return <span class="text-xs text-(--color-subtle)">ログイン設定が未完了です</span>
  }

  async function login(providerName: AuthProviderName) {
    if (!auth) {
      return
    }

    setStatus('loading')
    setErrorMessage(null)
    try {
      await signInWithPopup(auth, createAuthProvider(providerName))
      setStatus('idle')
    } catch (error) {
      console.error(error)
      setErrorMessage(translateFirebaseError(error))
      setStatus('error')
    }
  }

  async function logout() {
    if (!auth) {
      return
    }

    setStatus('loading')
    setFirebaseUser(null)
    setSessionUser(null)
    setErrorMessage(null)

    try {
      await signOut(auth)
      await fetch('/api/auth/session', { method: 'DELETE' })
      setStatus('idle')
    } catch (error) {
      console.error(error)
      setStatus('error')
      setErrorMessage('ログアウトに失敗しました。もう一度お試しください。')
    }
  }

  if (firebaseUser) {
    return <SignedInMenu firebaseUser={firebaseUser} sessionUser={sessionUser} status={status} onLogout={logout} />
  }

  return <SignedOutMenu errorMessage={errorMessage} status={status} onLogin={login} />
}

async function createSession(user: User) {
  const idToken = await user.getIdToken()
  const sessionResponse = await fetch('/api/auth/session', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ idToken }),
  })

  if (!sessionResponse.ok) {
    throw new Error('session_failed')
  }
}
