import { defineConfig } from "drizzle-kit";
import { env } from "./src/lib/env.ts";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: env.DATABASE_URL!,
  },
});
