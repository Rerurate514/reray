```txt
pnpm install
pnpm run db:migrate:local
pnpm run dev
```

```txt
pnpm run db:migrate:remote
pnpm run deploy
```

## D1 database

The Worker binding is `DB` in both local and deployed environments.

Use the local D1 database for day-to-day development:

```txt
pnpm run db:migrate:local
pnpm run preview
```

Use the remote D1 database for production migration checks:

```txt
pnpm run db:migrate:remote
pnpm run preview:remote
```

## Firebase Authentication

Reray uses Firebase Authentication for identity and stores application users in D1.
Set these Worker vars before testing login:

```txt
FIREBASE_PROJECT_ID
PUBLIC_FIREBASE_API_KEY
PUBLIC_FIREBASE_AUTH_DOMAIN
PUBLIC_FIREBASE_PROJECT_ID
PUBLIC_FIREBASE_APP_ID
```

The public Firebase values are from the Firebase Web App config. Google and GitHub providers should be enabled in Firebase Authentication.

[For generating/synchronizing types based on your Worker configuration run](https://developers.cloudflare.com/workers/wrangler/commands/#types):

```txt
npm run cf-typegen
```

Pass the `CloudflareBindings` as generics when instantiating `Hono`:

```ts
// src/index.ts
const app = new Hono<{ Bindings: CloudflareBindings }>()
```
