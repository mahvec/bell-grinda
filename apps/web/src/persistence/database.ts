import Dexie, { type EntityTable } from "dexie";
import type { Assessment, PainEvent, PerformanceSnapshot, PersonalRecord, ProgressionDecision, UserProfile, WorkoutSession } from "@bellgrinda/domain";

export class BellGrindaDatabase extends Dexie {
  profiles!: EntityTable<UserProfile, "id">;
  sessions!: EntityTable<WorkoutSession, "id">;
  painEvents!: EntityTable<PainEvent, "id">;
  progressionDecisions!: EntityTable<ProgressionDecision, "id">;
  assessments!: EntityTable<Assessment, "id">;
  personalRecords!: EntityTable<PersonalRecord, "id">;
  performanceSnapshots!: EntityTable<PerformanceSnapshot, "id">;

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
    this.version(3).stores({
      profiles: "id, createdAt",
      sessions: "id, status, startedAt, updatedAt, completedAt",
      painEvents: "id, sessionId, exerciseId, bodyLocation, severity, occurredAt"
    }).upgrade(async (transaction) => {
      await transaction.table<WorkoutSession>("sessions").toCollection().modify((session) => {
        session.setLogs ??= [];
        session.completionType ??= null;
        session.endReason ??= "";
        session.durationSeconds ??= null;
        session.sessionSchemaVersion = 2;
      });
    });
    this.version(4).stores({
      profiles: "id, createdAt",
      sessions: "id, status, startedAt, updatedAt, completedAt",
      painEvents: "id, sessionId, exerciseId, bodyLocation, severity, occurredAt",
      progressionDecisions: "id, sessionId, scope, exerciseId, decision, createdAt"
    });
    this.version(5).stores({
      profiles: "id, createdAt",
      sessions: "id, status, startedAt, updatedAt, completedAt",
      painEvents: "id, sessionId, exerciseId, bodyLocation, severity, occurredAt",
      progressionDecisions: "id, sessionId, scope, exerciseId, decision, createdAt",
      assessments: "id, date, type, createdAt",
      personalRecords: "id, exerciseId, recordType, sessionId, date",
      performanceSnapshots: "id, calculatedAt, sourceSessionId, sourceAssessmentId"
    });
  }
}

export const db = new BellGrindaDatabase();

export const profileRepository = {
  get: () => db.profiles.toCollection().first(),
  save: (profile: UserProfile) => db.profiles.put(profile)
};

export const sessionRepository = {
  getActive: () => db.sessions.where("status").anyOf(["active", "paused", "review_pending"]).first(),
  listRecent: () => db.sessions.orderBy("startedAt").reverse().limit(20).toArray(),
  listHistory: async () => (await db.sessions.where("status").anyOf(["completed", "partial", "abandoned"]).toArray()).sort((a, b) => b.startedAt.localeCompare(a.startedAt)),
  getById: (id: string) => db.sessions.get(id),
  completedSince: (date: string) => db.sessions.where("completedAt").aboveOrEqual(date).filter((session) => session.status === "completed").toArray(),
  save: (session: WorkoutSession) => db.sessions.put(session)
};

export const painEventRepository = {
  append: (event: PainEvent) => db.painEvents.add(event),
  listAll: () => db.painEvents.orderBy("occurredAt").reverse().toArray(),
  listForSession: (sessionId: string) => db.painEvents.where("sessionId").equals(sessionId).sortBy("occurredAt"),
  recordForSession: (event: PainEvent, session: WorkoutSession) => db.transaction("rw", db.painEvents, db.sessions, async () => {
    await db.painEvents.add(event);
    await db.sessions.put(session);
  })
};

export const progressionDecisionRepository = {
  saveMany: (decisions: ProgressionDecision[]) => db.progressionDecisions.bulkPut(decisions),
  listAll: () => db.progressionDecisions.orderBy("createdAt").reverse().toArray(),
  listForSession: (sessionId: string) => db.progressionDecisions.where("sessionId").equals(sessionId).toArray(),
  listLatestApplicable: async () => {
    const decisions = await db.progressionDecisions.orderBy("createdAt").reverse().toArray();
    const latest = new Map<string, ProgressionDecision>();
    for (const decision of decisions) {
      const key = decision.scope === "session" ? "session" : `exercise:${decision.exerciseId}`;
      if (!latest.has(key)) latest.set(key, decision);
    }
    return [...latest.values()];
  }
};

export const assessmentRepository = {
  save: (assessment: Assessment) => db.assessments.put(assessment),
  list: () => db.assessments.orderBy("date").reverse().toArray(),
  latest: () => db.assessments.orderBy("date").last()
};

export const personalRecordRepository = {
  saveMany: (records: PersonalRecord[]) => records.length ? db.personalRecords.bulkPut(records) : Promise.resolve(),
  list: () => db.personalRecords.orderBy("date").reverse().toArray()
};

export const performanceSnapshotRepository = {
  save: (snapshot: PerformanceSnapshot) => db.performanceSnapshots.put(snapshot),
  list: () => db.performanceSnapshots.orderBy("calculatedAt").reverse().toArray(),
  latest: () => db.performanceSnapshots.orderBy("calculatedAt").last()
};
