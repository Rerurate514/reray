import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './app/infrastructure/providers/db/schema/index.ts',
  out: './drizzle',
  dialect: 'sqlite',
  driver: 'd1-http',
})
