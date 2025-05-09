import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema:
    process.env.NODE_ENV === "production"
      ? "./db/schema.js"
      : "./src/db/schema.js",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
