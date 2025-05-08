import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema.js";
import "dotenv/config";
import { env } from "@/src/lib/env.js";

const sqlite = new Database(env.DATABASE_URL ?? "sqlite.db");

console.log(env.DATABASE_URL);
export const db = drizzle(sqlite, { schema });
