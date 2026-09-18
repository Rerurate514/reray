import { RadioOption } from './radio-option'

export function VisibilityFields() {
  return (
    <fieldset class="grid gap-3 border-t border-(--color-border) pt-5">
      <legend class="text-sm font-semibold">公開範囲</legend>
      <RadioOption name="visibility" value="public" title="公開" description="トップページの開催中リレーに表示します。" checked />
      <RadioOption name="visibility" value="private" title="限定共有" description="一覧には表示せず、URLを知っている人だけ見られます。" />
    </fieldset>
  )
}
