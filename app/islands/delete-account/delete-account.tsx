import { initializeApp, getApps } from 'firebase/app'
import { getAuth, signOut } from 'firebase/auth'
import { useMemo, useState } from 'hono/jsx'
import type { PublicFirebaseConfig } from '../../application/auth/firebaseConfig'
import { DeleteAccountPanel } from './delete-account-panel'

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

    const confirmed = window.confirm('アカウントを削除します。作成したリレーは残りますが編集・削除はできなくなり、担当している枠は「退会済み」表示になって空き枠に戻ります。よろしいですか？')
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
      const data = await response.json().catch(() => null)

      if (!response.ok) {
        setError(translateDeleteAccountError(data))
        setIsDeleting(false)
        return
      }

      if (auth) {
        await signOut(auth).catch(() => undefined)
      }

      window.location.href = '/?account_deleted=1'
    } catch {
      setError(genericDeleteError)
      setIsDeleting(false)
    }
  }

  return <DeleteAccountPanel error={error} isDeleting={isDeleting} onDelete={handleDelete} />
}

const genericDeleteError = 'アカウントを削除できませんでした。ログイン状態を確認してもう一度お試しください。'
const reauthRequiredError = 'セキュリティのため、いったんログアウトして再度ログインしてから削除してください。'

function translateDeleteAccountError(data: unknown) {
  const error = data && typeof data === 'object' && 'error' in data ? (data as { error: unknown }).error : null
  if (error === 'Please sign in again before deleting your account') {
    return reauthRequiredError
  }

  return genericDeleteError
}
