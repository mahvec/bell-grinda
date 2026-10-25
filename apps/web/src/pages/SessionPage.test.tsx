import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { createSession, generatedWorkoutSchema } from "@bellgrinda/domain";
import { db } from "../persistence/database";
import { setActiveSession, store } from "../state/store";
import { SessionPage } from "./SessionPage";

const workout = generatedWorkoutSchema.parse({
  id: "completion-flow",
  date: "2026-10-19",
  title: "Completion test",
  focus: "Accurate logging",
  rounds: 1,
  estimatedMinutes: 10,
  readiness: { score: 90, status: "green", reasonCodes: ["ready"], guidance: "Train as planned." },
  exercises: [{ id: "goblet-squat", name: "Goblet squat", category: "strength", target: "12 reps", loadKg: 12 }],
  reasonCodes: ["test"],
  engineVersion: "test"
});

const renderSession = () => render(<Provider store={store}><MemoryRouter><SessionPage /></MemoryRouter></Provider>);

describe("workout completion flow", () => {
  beforeEach(async () => {
    await db.delete();
    await db.open();
    const session = createSession(workout, new Date("2026-10-19T06:00:00.000Z"));
    await db.sessions.put(session);
    store.dispatch(setActiveSession(session));
  });

  it("records actual work, RPE, and notes before finalizing", async () => {
    renderSession();
    fireEvent.change(screen.getByLabelText(/actual reps/i), { target: { value: "9" } });
    fireEvent.change(screen.getByLabelText(/actual load/i), { target: { value: "10" } });
    fireEvent.click(screen.getByRole("button", { name: /complete set/i }));

    expect(await screen.findByRole("heading", { name: "Review your work." })).toBeInTheDocument();
    expect(screen.getByText(/9 reps/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "7" }));
    fireEvent.change(screen.getByLabelText(/workout notes/i), { target: { value: "Strong session." } });
    fireEvent.click(screen.getByRole("button", { name: /finalize workout/i }));

    await waitFor(async () => expect((await db.sessions.toCollection().first())?.status).toBe("completed"));
    const saved = await db.sessions.toCollection().first();
    expect(saved).toMatchObject({ rpe: 7, notes: "Strong session.", completionType: "completed" });
    expect(saved?.setLogs[0]).toMatchObject({ actualReps: 9, actualLoadKg: 10, status: "completed" });
    expect(await db.progressionDecisions.where("sessionId").equals(saved!.id).count()).toBe(1);
  });

  it("reviews and finalizes useful partial work", async () => {
    renderSession();
    fireEvent.click(screen.getByRole("button", { name: "End workout" }));
    fireEvent.change(screen.getByLabelText(/reason/i), { target: { value: "Short on time." } });
    fireEvent.click(screen.getByRole("button", { name: /complete as partial/i }));

    expect(await screen.findByText("Partial session saved")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /finalize workout/i }));
    await waitFor(async () => expect((await db.sessions.toCollection().first())?.status).toBe("partial"));
    expect(await db.sessions.toCollection().first()).toMatchObject({ completionType: "partial", endReason: "Short on time." });
  });

  it("retains a minimal abandoned-session record", async () => {
    renderSession();
    fireEvent.click(screen.getByRole("button", { name: "End workout" }));
    fireEvent.change(screen.getByLabelText(/reason/i), { target: { value: "Interrupted." } });
    fireEvent.click(screen.getByRole("button", { name: /abandon workout/i }));

    await waitFor(async () => expect((await db.sessions.toCollection().first())?.status).toBe("abandoned"));
    expect(await db.sessions.toCollection().first()).toMatchObject({ completionType: "abandoned", endReason: "Interrupted.", rpe: null });
  });
});
