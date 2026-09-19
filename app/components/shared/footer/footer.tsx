import { RerayRule } from '../reray-rule/index'

const footerLinks = [
  { href: '/', label: '一覧' },
  { href: '/new', label: 'リレー作成' },
  { href: '/me', label: '自分の予定' },
]

const profileLinks = [
  { href: 'https://x.com/rerurate', label: 'X / @rerurate' },
  { href: 'https://github.com/Rerurate514', label: 'GitHub / @Rerurate514' },
  { href: 'https://rerurate.com/', label: 'rerurate.com' },
]

export function Footer() {
  return (
    <footer class="relative left-1/2 mt-20 -mb-6 w-screen -translate-x-1/2 bg-(--color-text) text-(--color-page)">
      <div class="mx-auto w-full max-w-6xl px-5 pt-7 sm:px-8">
        <div class="grid gap-10 py-8 sm:grid-cols-[minmax(0,1.45fr)_minmax(260px,.55fr)] sm:items-start sm:py-12">
          <div class="min-w-0">
            <p class="font-['Reray_Futura'] text-[clamp(4rem,12vw,9.5rem)] font-medium leading-[.82] tracking-tight text-(--color-page)">
              Project Code
            </p>
            <div class="mt-7 flex flex-wrap items-end gap-x-6 gap-y-3">
              <p class="reray-wordmark text-4xl font-medium leading-none tracking-tight sm:text-6xl">Reray</p>
              <p class="max-w-md border-l border-(--color-accent) pl-4 text-sm leading-7 text-[#d7cbbb]">
                Article Relay Calendar
              </p>
            </div>
            <p class="mt-7 max-w-2xl leading-8 text-[#d7cbbb]">
              テーマをひとつ置いて、記事を書く人の時間をゆるく束ねる。Reray は外部記事のリレーを進めるための小さなカレンダーです。
            </p>
          </div>
          <div class="grid gap-8 border-t border-[#f6efe266] pt-6 sm:border-t-0 sm:pt-2">
            <nav class="grid gap-3 text-sm font-semibold" aria-label="Footer">
              {footerLinks.map((link) => (
                <a class="group flex items-center justify-between border-b border-[#f6efe226] pb-3 hover:text-(--color-accent)" href={link.href}>
                  <span>{link.label}</span>
                  <span class="text-(--color-accent)">/</span>
                </a>
              ))}
            </nav>
            <nav class="grid gap-3 text-sm" aria-label="Rerurate profiles">
              {profileLinks.map((link) => (
                <a class="group flex items-center justify-between gap-4 font-semibold text-(--color-accent) hover:text-(--color-page)" href={link.href} rel="noreferrer" target="_blank">
                  <span class="underline decoration-[#f6efe266] decoration-1 underline-offset-4">{link.label}</span>
                  <span class="text-[#d7cbbb] group-hover:text-(--color-accent)">↗</span>
                </a>
              ))}
            </nav>
          </div>
        </div>
        <RerayRule />
        <div class="py-5 text-xs font-semibold text-[#d7cbbb]">
          <p class="text-right">2026 © Reurate_514, rerurate.com, All Rights Reserved</p>
        </div>
      </div>
    </footer>
  )
}
