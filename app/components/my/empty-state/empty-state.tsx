export function EmptyState({
  actionHref,
  actionLabel,
  body,
  title,
  variant,
}: {
  actionHref: string
  actionLabel: string
  body: string
  title: string
  variant: 'primary' | 'secondary'
}) {
  const actionClass = variant === 'primary'
    ? 'bg-(--color-text) text-(--color-page) hover:bg-(--color-accent-hover)'
    : 'border border-(--color-border-strong) hover:border-(--color-accent) hover:text-(--color-accent)'

  return (
    <div class="mt-4 border-y border-dashed border-(--color-border-strong) py-8">
      <h3 class="text-xl font-semibold tracking-tight">{title}</h3>
      <p class="mt-3 max-w-2xl text-sm leading-7 text-(--color-muted)">{body}</p>
      <a class={`mt-5 inline-block px-5 py-3 text-sm font-semibold ${actionClass}`} href={actionHref}>{actionLabel}</a>
    </div>
  )
}
