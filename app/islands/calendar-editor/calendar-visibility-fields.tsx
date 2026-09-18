export function CalendarVisibilityFields({ visibility }: { visibility: 'public' | 'private' }) {
  return (
    <fieldset class="grid gap-3 border-t border-(--color-border) pt-5">
      <legend class="text-sm font-semibold">公開範囲</legend>
      <label class="flex items-start gap-3 text-sm">
        <input class="mt-1 accent-(--color-accent)" type="radio" name="visibility" value="public" checked={visibility === 'public'} />
        <span>
          <span class="block font-semibold">公開</span>
          <span class="block text-(--color-muted)">トップページの開催中リレーに表示します。</span>
        </span>
      </label>
      <label class="flex items-start gap-3 text-sm">
        <input class="mt-1 accent-(--color-accent)" type="radio" name="visibility" value="private" checked={visibility === 'private'} />
        <span>
          <span class="block font-semibold">限定共有</span>
          <span class="block text-(--color-muted)">一覧には表示せず、URLを知っている人だけ見られます。</span>
        </span>
      </label>
    </fieldset>
  )
}
