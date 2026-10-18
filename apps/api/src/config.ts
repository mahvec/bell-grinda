import "dotenv/config";
import { z } from "zod";

const configSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65_535).default(3001),
  DATABASE_URL: z.string().url().optional(),
  CORS_ORIGIN: z.string().url().optional(),
  LOCAL_USER_ID: z.string().uuid().default("00000000-0000-4000-8000-000000000001")
});

export type AppConfig = z.infer<typeof configSchema>;

export const loadConfig = (environment: NodeJS.ProcessEnv = process.env): AppConfig => configSchema.parse(environment);
