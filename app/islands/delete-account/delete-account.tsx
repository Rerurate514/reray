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

  return <DeleteAccountPanel error={error} isDeleting={isDeleting} onDelete={handleDelete} />
}
