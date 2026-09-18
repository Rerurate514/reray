import { SectionNumber } from '../shared/section-number'

export function HeroSection() {
  return (
    <section class="grid gap-10 py-12 sm:py-16">
      <SectionNumber number="01 /" label="Relay Boards" large />
      <div>
        <div class="bg-(--color-text) px-4 py-3 text-xl font-semibold tracking-tight text-(--color-page) sm:text-3xl">
          いつでも作れる記事リレー
        </div>
        <h1 class="mt-8 max-w-3xl text-4xl font-medium leading-[1.08] tracking-tight sm:text-6xl">
          テーマを決めて、枠を配って、記事をつなぐ。
        </h1>
        <p class="mt-8 max-w-2xl text-base leading-8 text-(--color-muted)">
          Reray は Zenn、Qiita、note、個人ブログなどの外部記事 URL を集めるための進行管理サービスです。
          カレンダーを作成して共有すれば、参加者は空き枠を選んで記事を登録できます。
        </p>
        <div class="reray-rule mt-10" aria-hidden="true"><span></span><span></span><span></span></div>
      </div>
    </section>
  )
}
