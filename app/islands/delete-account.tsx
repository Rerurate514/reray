import { initializeApp, getApps } from 'firebase/app'
import { getAuth, signOut } from 'firebase/auth'
import { useMemo, useState } from 'hono/jsx'
import type { PublicFirebaseConfig } from '../application/auth/firebaseConfig'

type Props = {
  config: PublicFirebaseConfig | null
}

export default function DeleteAccount({ config }: Props) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const auth = useMemo(() => {
    if (!config) {
      return null
    }

    const app = getApps()[0] ?? initializeApp(config)
    return getAuth(app)
  }, [config])

  async function handleDelete() {
    if (isDeleting) {
      return
    }

    const confirmed = window.confirm('アカウントを削除します。作成したリレーは削除され、担当中の枠は空き枠に戻ります。よろしいですか？')
    if (!confirmed) {
      return
    }

    setIsDeleting(true)
    setError(null)

    try {
      const response = await fetch('/api/account/delete', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('delete_failed')
      }

      if (auth) {
        await signOut(auth)
      }

      window.location.href = '/?account_deleted=1'
    } catch {
      setError('アカウントを削除できませんでした。ログイン状態を確認してもう一度お試しください。')
      setIsDeleting(false)
    }
  }

  return (
    <div class="mt-10 border-t border-(--color-border) pt-6">
      <div class="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-start">
        <div>
          <h2 class="text-lg font-semibold tracking-tight">アカウント削除</h2>
          <p class="mt-2 max-w-2xl text-sm leading-7 text-(--color-muted)">
            アプリ内のアカウントを削除します。作成したリレーは削除され、担当している枠は空き枠に戻ります。
          </p>
        </div>
        <button
          class="border border-(--color-red) px-4 py-3 text-sm font-semibold text-(--color-red) hover:bg-(--color-red) hover:text-(--color-page) disabled:cursor-not-allowed disabled:opacity-60"
          type="button"
          disabled={isDeleting}
          onClick={handleDelete}
        >
          {isDeleting ? '削除中' : 'アカウントを削除'}
        </button>
      </div>
      {error ? <p class="mt-3 text-sm font-semibold text-(--color-red)">{error}</p> : null}
    </div>
  )
}
