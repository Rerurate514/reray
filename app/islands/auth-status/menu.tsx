export function MenuShell({
  children,
  trigger,
}: {
  children: JSX.Element | JSX.Element[]
  trigger: JSX.Element
}) {
  return (
    <details class="relative">
      <summary class="cursor-pointer list-none" aria-label="メニュー">
        {trigger}
      </summary>
      <div class="absolute right-0 z-20 mt-2 w-56 border border-(--color-border) bg-[#fffaf2] py-1 shadow-[0_12px_28px_rgba(32,25,25,.16)]">
        {children}
      </div>
    </details>
  )
}

export function SignedOutTrigger() {
  return (
    <span class="flex items-center gap-2">
      <span class="flex h-10 items-center border border-(--color-border-strong) px-3 text-sm font-semibold text-(--color-text) hover:border-(--color-accent) hover:text-(--color-accent)">
        ログイン
      </span>
      <span class="grid h-10 w-10 place-items-center border border-(--color-border-strong) text-2xl leading-none text-(--color-text) hover:border-(--color-accent) hover:text-(--color-accent)">
        ≡
      </span>
    </span>
  )
}

export function SignedInTrigger({
  avatarUrl,
  displayName,
  username,
}: {
  avatarUrl: string | null
  displayName: string
  username: string
}) {
  return (
    <span class="flex items-center gap-2">
      <span class="flex h-10 items-center gap-2 border border-(--color-border) bg-[#fff8ed] px-2 pr-3">
        {avatarUrl ? (
          <img class="h-7 w-7 rounded-full border border-(--color-border-strong) object-cover" src={avatarUrl} alt={displayName} />
        ) : (
          <span class="grid h-7 w-7 place-items-center rounded-full border border-(--color-border-strong) text-xs font-semibold text-(--color-muted)">{displayName.slice(0, 1)}</span>
        )}
        <span class="hidden max-w-28 truncate text-sm font-semibold text-(--color-text) sm:inline">@{username}</span>
      </span>
      <span class="grid h-10 w-10 place-items-center border border-(--color-border-strong) text-2xl leading-none text-(--color-text) hover:border-(--color-accent) hover:text-(--color-accent)">
        ≡
      </span>
    </span>
  )
}

export function MenuButton({
  icon,
  label,
  loading,
  onClick,
}: {
  icon: string
  label: string
  loading: boolean
  onClick: () => void
}) {
  return (
    <button class="flex w-full items-center gap-3 px-3 py-3 text-left text-sm text-(--color-muted) hover:bg-(--color-surface-muted) hover:text-(--color-text) disabled:opacity-60" type="button" disabled={loading} onClick={onClick}>
      <span class="w-5 text-center text-base font-semibold text-(--color-subtle)">{icon}</span>
      <span>{label}</span>
    </button>
  )
}

export function MenuLink({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <a class="flex items-center gap-3 px-3 py-3 text-sm text-(--color-muted) hover:bg-(--color-surface-muted) hover:text-(--color-text)" href={href}>
      <span class="w-5 text-center text-base font-semibold text-(--color-subtle)">{icon}</span>
      <span>{label}</span>
    </a>
  )
}
