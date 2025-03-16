import { env } from "@/env";

import type { Config } from "drizzle-kit";

export default {
  schema: "./src/server/db/schema.ts",
  out: "./migrations",
  driver: "turso",
  dialect: "sqlite",
  dbCredentials: {
    url: env.DATABASE_URL!,
    authToken: env.TURSO_AUTH_TOKEN,
  },
} satisfies Config;
