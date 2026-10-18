CREATE TABLE "users" (
  "id" uuid PRIMARY KEY NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "profiles" (
  "user_id" uuid PRIMARY KEY NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "payload" jsonb NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "workout_sessions" (
  "id" uuid PRIMARY KEY NOT NULL,
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "payload" jsonb NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX "workout_sessions_user_updated_at_idx" ON "workout_sessions" ("user_id", "updated_at" DESC);

CREATE TABLE "pain_events" (
  "id" uuid PRIMARY KEY NOT NULL,
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "session_id" uuid NOT NULL,
  "payload" jsonb NOT NULL,
  "occurred_at" timestamp with time zone NOT NULL
);

CREATE INDEX "pain_events_user_occurred_at_idx" ON "pain_events" ("user_id", "occurred_at" DESC);
