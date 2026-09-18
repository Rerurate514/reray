export function SectionNumber({
  label,
  large = false,
  number,
}: {
  label: string
  large?: boolean
  number: string
}) {
  return (
    <div class={`flex items-baseline ${large ? 'sm:pt-3' : ''}`}>
      <span class={`${large ? 'text-6xl sm:text-7xl' : 'text-5xl'} font-light leading-none text-(--color-accent)`}>{number}</span>
      <span class="mt-2 text-sm italic text-(--color-muted)">{label}</span>
    </div>
  )
}
