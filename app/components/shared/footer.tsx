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
      <div class="mx-auto w-full max-w-6xl px-5 pt-8 sm:px-8">
        <div class="grid gap-10 pb-10 sm:grid-cols-[minmax(0,1.35fr)_minmax(220px,.65fr)] sm:items-end">
          <div>
            <p class="font-['Reray_Futura'] text-5xl font-bold leading-none tracking-tight text-(--color-page) sm:text-7xl">
              Project Code
            </p>
            <p class="reray-wordmark mt-6 text-4xl font-medium leading-none tracking-tight sm:text-6xl">Reray</p>
            <p class="mt-5 max-w-xl leading-8 text-[#d7cbbb]">
              テーマをひとつ置いて、記事を書く人の時間をゆるく束ねる。Reray は外部記事のリレーを進めるための小さなカレンダーです。
            </p>
          </div>
          <div class="border-t border-[#f6efe266] pt-5 sm:border-t-0 sm:pt-0">
            <nav class="flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold" aria-label="Footer">
              {footerLinks.map((link) => (
                <a class="underline decoration-(--color-accent) decoration-1 underline-offset-4 hover:text-(--color-accent)" href={link.href}>
                  {link.label}
                </a>
              ))}
            </nav>
            <nav class="mt-8 grid gap-3 text-sm" aria-label="Rerurate profiles">
              {profileLinks.map((link) => (
                <a class="font-semibold text-(--color-accent) underline decoration-[#f6efe266] decoration-1 underline-offset-4 hover:text-(--color-page)" href={link.href} rel="noreferrer" target="_blank">
                  {link.label}
                </a>
              ))}
            </nav>
            <p class="mt-8 border-t border-[#f6efe266] pt-4 text-sm font-semibold text-[#d7cbbb]">
              2026 © Reurate_514, All Rights Reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
