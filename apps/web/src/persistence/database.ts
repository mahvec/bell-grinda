import Dexie, { type EntityTable } from "dexie";
import type { PainEvent, UserProfile, WorkoutSession } from "@bellgrinda/domain";

export class BellGrindaDatabase extends Dexie {
  profiles!: EntityTable<UserProfile, "id">;
  sessions!: EntityTable<WorkoutSession, "id">;
  painEvents!: EntityTable<PainEvent, "id">;

  constructor(name = "bellgrinda") {
    super(name);
    this.version(1).stores({
      profiles: "id, createdAt",
      sessions: "id, status, startedAt, updatedAt, completedAt"
    });
    this.version(2).stores({
      profiles: "id, createdAt",
      sessions: "id, status, startedAt, updatedAt, completedAt",
      painEvents: "id, sessionId, exerciseId, bodyLocation, severity, occurredAt"
    }).upgrade(async (transaction) => {
      await transaction.table<WorkoutSession>("sessions").toCollection().modify((session) => {
        session.substitutions ??= [];
        session.painEventIds ??= [];
      });
    });
  }
}

export const db = new BellGrindaDatabase();

export const profileRepository = {
  get: () => db.profiles.toCollection().first(),
  save: (profile: UserProfile) => db.profiles.put(profile)
};

export const sessionRepository = {
  getActive: () => db.sessions.where("status").anyOf(["active", "paused"]).first(),
  listRecent: () => db.sessions.orderBy("startedAt").reverse().limit(20).toArray(),
  completedSince: (date: string) => db.sessions.where("completedAt").aboveOrEqual(date).filter((session) => session.status === "completed").toArray(),
  save: (session: WorkoutSession) => db.sessions.put(session)
};

export const painEventRepository = {
  append: (event: PainEvent) => db.painEvents.add(event),
  listForSession: (sessionId: string) => db.painEvents.where("sessionId").equals(sessionId).sortBy("occurredAt"),
  recordForSession: (event: PainEvent, session: WorkoutSession) => db.transaction("rw", db.painEvents, db.sessions, async () => {
    await db.painEvents.add(event);
    await db.sessions.put(session);
  })
};
