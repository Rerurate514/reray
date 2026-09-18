import { useState } from 'hono/jsx'

type Props = {
  calendar: {
    id: string
    title: string
  }
}

export default function DeleteCalendar({ calendar }: Props) {
  const [isDeleting, setIsDeleting] = useState(false)

  function handleSubmit(event: Event) {
    if (isDeleting) {
      event.preventDefault()
      return
    }

    const confirmed = window.confirm(`「${calendar.title}」を削除します。参加枠と登録済みの記事も削除されます。よろしいですか？`)
    if (!confirmed) {
      event.preventDefault()
      return
    }

    setIsDeleting(true)
  }

  return (
    <form method="post" action={`/api/calendars/${calendar.id}/delete`} onSubmit={handleSubmit}>
      <button
        class="border border-(--color-border-strong) px-3 py-2 text-sm font-semibold text-(--color-red) hover:border-(--color-red) disabled:cursor-not-allowed disabled:opacity-60"
        type="submit"
        disabled={isDeleting}
      >
        {isDeleting ? '削除中' : '削除'}
      </button>
    </form>
  )
}
