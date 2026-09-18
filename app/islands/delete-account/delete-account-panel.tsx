export function DeleteAccountPanel({
  error,
  isDeleting,
  onDelete,
}: {
  error: string | null
  isDeleting: boolean
  onDelete: () => void
}) {
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
          onClick={onDelete}
        >
          {isDeleting ? '削除中' : 'アカウントを削除'}
        </button>
      </div>
      {error ? <p class="mt-3 text-sm font-semibold text-(--color-red)">{error}</p> : null}
    </div>
  )
}
