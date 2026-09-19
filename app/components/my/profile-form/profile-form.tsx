import type { AuthenticatedUser } from '../../../domain/user/entities/user'

export function ProfileForm({ user }: { user: AuthenticatedUser }) {
  return (
    <form method="post" action="/api/account/profile" class="mt-8 grid gap-3 border-y border-(--color-border) py-6 sm:grid-cols-[1fr_auto] sm:items-end">
      <label class="grid gap-2">
        <span class="text-sm font-semibold">表示名</span>
        <input class="reray-input px-3 py-3" name="displayName" value={user.displayName} maxlength={40} required />
      </label>
      <button class="bg-(--color-text) px-4 py-3 text-sm font-semibold text-(--color-page) hover:bg-(--color-accent-hover)" type="submit">保存</button>
    </form>
  )
}
