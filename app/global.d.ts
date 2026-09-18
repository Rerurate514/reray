import type {} from 'hono'

type PageMeta = {
  title?: string
  description?: string
  url?: string
  image?: {
    url: string
    width: number
    height: number
    alt?: string
  }
  discordComponentEmbed?: string
}

declare module 'hono' {
  interface ContextRenderer {
    (content: string | Promise<string>, meta?: PageMeta): Response | Promise<Response>
  }

  interface Env {
    Variables: {}
    Bindings: {
      DB: D1Database
      FIREBASE_PROJECT_ID: string
      PUBLIC_FIREBASE_API_KEY: string
      PUBLIC_FIREBASE_AUTH_DOMAIN: string
      PUBLIC_FIREBASE_PROJECT_ID: string
      PUBLIC_FIREBASE_APP_ID: string
    }
  }
}
