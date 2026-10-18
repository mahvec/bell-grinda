import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import type { AppConfig } from "../config.js";
import * as schema from "./schema.js";

export type Database = ReturnType<typeof createDatabase>;

export function createDatabase(databaseUrl: string) {
  const pool = new Pool({ connectionString: databaseUrl, max: 5 });
  return drizzle({ client: pool, schema });
}

export function databaseFromConfig(config: AppConfig): Database | undefined {
  return config.DATABASE_URL ? createDatabase(config.DATABASE_URL) : undefined;
}
