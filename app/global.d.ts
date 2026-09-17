import type {} from 'hono'

declare module 'hono' {
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
