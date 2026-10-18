import { migrate } from "drizzle-orm/node-postgres/migrator";
import { loadConfig } from "../config.js";
import { createDatabase } from "./client.js";

const config = loadConfig();

if (!config.DATABASE_URL) {
  throw new Error("DATABASE_URL is required to run database migrations.");
}

await migrate(createDatabase(config.DATABASE_URL), { migrationsFolder: "src/database/migrations" });
