import type { PublicFirebaseConfig } from '../../application/auth/firebaseConfig'
import type { CalendarSummary } from '../../application/calendar/dtos/calendarSummary'
import AuthStatus from '../../islands/auth-status/auth-status'
import { Footer } from '../shared/footer'
import { HeroSection } from './hero-section'
import { PublicCalendarsSection } from './public-calendars-section'

export function HomePage({ calendars, firebaseConfig }: { calendars: CalendarSummary[]; firebaseConfig: PublicFirebaseConfig | null }) {
  return (
    <main class="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6 sm:px-8">
      <title>Reray</title>
      <HomeHeader firebaseConfig={firebaseConfig} />
      <HeroSection />
      <PublicCalendarsSection calendars={calendars} />
      <Footer />
    </main>
  )
}

function HomeHeader({ firebaseConfig }: { firebaseConfig: PublicFirebaseConfig | null }) {
  return (
    <header class="flex flex-col gap-4 border-b border-(--color-text) pb-5 sm:flex-row sm:items-center sm:justify-between">
      <a href="/" class="reray-wordmark text-xl font-semibold tracking-tight">Reray</a>
      <nav class="flex flex-wrap items-center gap-2 text-sm">
        <a class="border border-(--color-border-strong) px-3 py-2 font-semibold text-(--color-muted) hover:border-(--color-accent) hover:text-(--color-accent)" href="/me">自分の予定</a>
        <a class="bg-(--color-text) px-4 py-2 font-semibold text-(--color-page) hover:bg-(--color-accent-hover)" href="/new">リレーを作る</a>
        <span class="mx-1 hidden h-6 border-l border-(--color-border) sm:inline-block"></span>
        <AuthStatus config={firebaseConfig} />
      </nav>
    </header>
  )
}
