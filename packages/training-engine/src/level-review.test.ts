import { describe, expect, it } from "vitest";
import { createSession, type PainEvent, type UserProfile, type WorkoutSession } from "@bellgrinda/domain";
import { createLevelTrial, evaluateLevelReadiness, evaluateLevelTrial } from "./level-review";
import { generateProgramWorkout } from "./programs";

const profile: UserProfile = { id: "user", name: "Ada", trainingLevel: "novice", phase: 1, equipment: ["kettlebell_12"], defaultKettlebellKg: 12, createdAt: "2026-10-01T00:00:00.000Z" };
const workout = generateProgramWorkout(new Date("2026-10-19T09:00:00.000Z"), { score: 90, status: "green", reasonCodes: [], guidance: "Train" }, profile);
const session = (id: string, rpe: number, completion = 100): WorkoutSession => {
  const item = createSession({ ...workout, id }, new Date(`2026-10-${10 + Number(id)}T09:00:00.000Z`));
  const planned = item.workout.rounds * item.workout.exercises.length;
  return { ...item, id, status: "completed", completedAt: item.updatedAt, completionType: "completed", rpe, setLogs: Array.from({ length: Math.round(planned * completion / 100) }, (_, index) => ({ exerciseId: workout.exercises[index % workout.exercises.length]!.id, exerciseName: workout.exercises[index % workout.exercises.length]!.name, round: Math.floor(index / workout.exercises.length) + 1, status: "completed" as const, plannedTarget: "10 reps", actualTarget: "10 reps", actualReps: 10, plannedLoadKg: 12, actualLoadKg: 12, recordedAt: item.updatedAt })) };
};

describe("early level review", () => {
  it("does not approve one easy session", () => { expect(evaluateLevelReadiness(profile, [session("1", 5)], []).result).toBe("not_ready"); });
  it("approves a trial after several easy completed sessions", () => { const result = evaluateLevelReadiness(profile, [session("1", 5), session("2", 6), session("3", 5)], []); expect(result).toMatchObject({ result: "trial_approved", proposedLevel: "advanced_novice" }); });
  it("blocks a trial when moderate pain is present", () => {
    const sessions = [session("1", 5), session("2", 5), session("3", 5)];
    const pain: PainEvent = { id: "pain", sessionId: "1", exerciseId: "goblet-squat", bodyLocation: "knee", severity: "moderate", source: "workout", round: 1, notes: "", occurredAt: sessions[0]!.updatedAt };
    expect(evaluateLevelReadiness(profile, sessions, [pain]).blockers.join(" ")).toContain("pain");
  });
  it("passes a complete RPE 7 trial and rejects RPE 9", () => {
    const review = evaluateLevelReadiness(profile, [session("1", 5), session("2", 6), session("3", 5)], []);
    const trialWorkout = createLevelTrial(review, profile, new Date("2026-10-20T09:00:00.000Z"));
    const passed = { ...session("4", 7), workout: trialWorkout };
    const failed = { ...session("5", 9), workout: trialWorkout };
    expect(evaluateLevelTrial(review, passed, []).result).toBe("passed");
    expect(evaluateLevelTrial(review, failed, []).result).toBe("failed");
  });
});
