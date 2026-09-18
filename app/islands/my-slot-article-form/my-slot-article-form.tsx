import { useState } from 'hono/jsx'

type Props = {
  action: string
  articleTitle: string
  articleUrl: string
}

export default function MySlotArticleForm({ action, articleTitle, articleUrl }: Props) {
  const [title, setTitle] = useState(articleTitle)
  const [url, setUrl] = useState(articleUrl)
  const [status, setStatus] = useState('')

  async function fetchTitleCandidate(nextUrl: string) {
    if (!nextUrl || title.trim()) {
      return
    }

    setStatus('タイトルを取得しています。')

    const response = await fetch(`/api/articles/metadata?url=${encodeURIComponent(nextUrl)}`)
    const metadata = response.ok ? await response.json() as { title: string | null } : { title: null }

    if (metadata.title) {
      setTitle(metadata.title)
      setStatus('タイトル候補を入力しました。')
      return
    }

    setStatus('タイトルを取得できないURLです。保存時にURLからタイトルを作成します。')
  }

  return (
    <form method="post" action={action} class="grid gap-3">
      <div class="grid gap-3 sm:grid-cols-[1fr_1.4fr_auto]">
        <input
          class="reray-input px-3 py-3"
          name="title"
          value={title}
          placeholder="記事タイトル（空ならURLから自動）"
          onInput={(event) => setTitle(event.currentTarget.value)}
        />
        <input
          class="reray-input px-3 py-3"
          name="url"
          value={url}
          placeholder="https://example.com/article"
          required
          onInput={(event) => setUrl(event.currentTarget.value)}
          onBlur={() => fetchTitleCandidate(url)}
        />
        <button class="bg-(--color-text) px-4 py-3 text-sm font-semibold text-(--color-page) hover:bg-(--color-accent-hover)" type="submit">記事を保存</button>
      </div>
      {status ? <p class="text-xs text-(--color-muted)">{status}</p> : null}
    </form>
  )
}
