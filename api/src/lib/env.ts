import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);

// In production (Docker), the .env.local file will be mounted at /app/.env.local
// In development, it will be in the root directory
const envPath =
  process.env.NODE_ENV === "production"
    ? "/app/.env.local"
    : path.resolve(currentDir, "../../../.env.local");

dotenv.config({
  path: envPath,
});

export const env = process.env as Record<string, string>;
