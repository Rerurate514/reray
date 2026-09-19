export function RadioOption({
  checked = false,
  description,
  name,
  title,
  value,
}: {
  checked?: boolean
  description: string
  name: string
  title: string
  value: string
}) {
  return (
    <label class="flex items-start gap-3 text-sm">
      <input class="mt-1 accent-(--color-accent)" type="radio" name={name} value={value} checked={checked} />
      <span>
        <span class="block font-semibold">{title}</span>
        <span class="block text-(--color-muted)">{description}</span>
      </span>
    </label>
  )
}
