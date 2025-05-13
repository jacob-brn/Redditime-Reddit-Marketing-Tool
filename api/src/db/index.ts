import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema.ts";
import "dotenv/config";
import { env } from "../lib/env.ts";

const sqlite = new Database(env.DATABASE_URL ?? "sqlite.db");

export const db = drizzle(sqlite, { schema });
