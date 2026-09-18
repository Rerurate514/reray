export function MenuShell({ children }: { children: JSX.Element | JSX.Element[] }) {
  return (
    <details class="relative">
      <summary class="grid h-10 w-10 cursor-pointer list-none place-items-center border border-transparent text-2xl leading-none text-(--color-text) hover:border-(--color-border-strong)" aria-label="メニュー">
        ≡
      </summary>
      <div class="absolute right-0 z-20 mt-2 w-56 border border-(--color-border) bg-[#fffaf2] py-1 shadow-[0_12px_28px_rgba(32,25,25,.16)]">
        {children}
      </div>
    </details>
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
