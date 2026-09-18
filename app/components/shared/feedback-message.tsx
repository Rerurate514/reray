export function FeedbackMessage({ children, tone }: { children: string; tone: 'error' | 'success' }) {
  return tone === 'error' ? (
    <div class="mb-8 border border-(--color-red) px-4 py-3 text-sm font-semibold text-(--color-red)">{children}</div>
  ) : (
    <div class="mb-8 border border-(--color-green) px-4 py-3 text-sm font-semibold text-(--color-green)">{children}</div>
  )
}
