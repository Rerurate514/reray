import {
  cloudflareTest,
  readD1Migrations,
} from "@cloudflare/vitest-pool-workers";
import { defineConfig } from "vitest/config";

export default defineConfig(async () => {
  const migrations = await readD1Migrations("./drizzle");

  return {
    test: {
      projects: [
        {
          test: {
            name: "unit",
            environment: "node",
            include: [
              "tests/domain/**/*.test.ts",
              "tests/application/**/*.test.ts",
            ],
          },
        },
        {
          plugins: [
            cloudflareTest({
              wrangler: { configPath: "./wrangler.test.jsonc" },
              miniflare: { bindings: { TEST_MIGRATIONS: migrations } },
            }),
          ],
          test: {
            name: "workers",
            include: ["tests/infrastructure/**/*.test.ts"],
            setupFiles: ["./tests/apply-migrations.ts"],
          },
        },
      ],
    },
  };
});
