export function RerayRule(props: { class?: string }) {
  return (
    <div class={`reray-rule${props.class ? ` ${props.class}` : ''}`} aria-hidden="true">
      <span></span>
      <span></span>
      <span></span>
    </div>
  )
}
