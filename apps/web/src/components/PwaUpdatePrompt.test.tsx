import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createSession, type GeneratedWorkout } from "@bellgrinda/domain";
import { hydrate, setActiveSession, store } from "../state/store";
import { PwaUpdatePrompt } from "./PwaUpdatePrompt";

const pwa = vi.hoisted(() => ({
  needRefresh: true,
  updateServiceWorker: vi.fn(),
  onRegisteredSW: undefined as undefined | ((url: string, registration: ServiceWorkerRegistration) => void)
}));
vi.mock("virtual:pwa-register/react", () => ({
  useRegisterSW: (options: { onRegisteredSW: typeof pwa.onRegisteredSW }) => {
    pwa.onRegisteredSW = options.onRegisteredSW;
    return { needRefresh: [pwa.needRefresh], updateServiceWorker: pwa.updateServiceWorker };
  }
}));

const renderPrompt = () => render(<Provider store={store}><PwaUpdatePrompt /></Provider>);
const workout: GeneratedWorkout = {
  id: "update-test", date: "2026-10-25", title: "Test", focus: "Test", rounds: 1, estimatedMinutes: 10,
  readiness: { score: 90, status: "green", reasonCodes: [], guidance: "Ready" },
  exercises: [{ id: "push-up", name: "Push-up", category: "push", target: "10 reps", loadKg: null }],
  reasonCodes: [], engineVersion: "test"
};

describe("PWA updates", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    pwa.needRefresh = true;
    pwa.updateServiceWorker.mockResolvedValue(undefined);
    store.dispatch(hydrate({ profile: null, activeSession: null }));
  });

  it("activates a waiting update only when Restart is selected", async () => {
    renderPrompt();
    expect(screen.getByText("Update available")).toBeInTheDocument();
    expect(pwa.updateServiceWorker).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Restart to update" }));
    await waitFor(() => expect(pwa.updateServiceWorker).toHaveBeenCalledWith(true));
  });

  it.each(["active", "paused", "review_pending"] as const)("defers updates during a %s session", (status) => {
    store.dispatch(setActiveSession({ ...createSession(workout), status }));
    renderPrompt();
    expect(screen.queryByText("Update available")).not.toBeInTheDocument();
    act(() => { store.dispatch(setActiveSession(null)); });
    expect(screen.getByText("Update available")).toBeInTheDocument();
    expect(pwa.updateServiceWorker).not.toHaveBeenCalled();
  });

  it("stays hidden when no update is waiting", () => {
    pwa.needRefresh = false;
    renderPrompt();
    expect(screen.queryByRole("button", { name: "Restart to update" })).not.toBeInTheDocument();
  });

  it("checks on registration, foreground, and reconnection and cleans up listeners", async () => {
    const update = vi.fn().mockResolvedValue(undefined);
    const view = renderPrompt();
    act(() => { pwa.onRegisteredSW!("/sw.js", { update } as unknown as ServiceWorkerRegistration); });
    await waitFor(() => expect(update).toHaveBeenCalledTimes(1));
    fireEvent.click(screen.getByRole("button", { name: "Later" }));
    expect(screen.queryByText("Update available")).not.toBeInTheDocument();
    fireEvent(document, new Event("visibilitychange"));
    expect(screen.getByText("Update available")).toBeInTheDocument();
    await waitFor(() => expect(update).toHaveBeenCalledTimes(2));
    fireEvent(window, new Event("online"));
    await waitFor(() => expect(update).toHaveBeenCalledTimes(3));
    view.unmount();
    fireEvent(window, new Event("online"));
    expect(update).toHaveBeenCalledTimes(3);
  });

  it("lets the user retry if applying an update fails", async () => {
    pwa.updateServiceWorker.mockRejectedValueOnce(new Error("unavailable"));
    renderPrompt();
    fireEvent.click(screen.getByRole("button", { name: "Restart to update" }));
    expect(await screen.findByText("Could not apply the update. Please try again.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Restart to update" })).toBeEnabled();
  });

  it("skips offline checks and tolerates a failed check on reconnection", async () => {
    const online = vi.spyOn(navigator, "onLine", "get").mockReturnValue(false);
    const update = vi.fn().mockRejectedValue(new Error("network unavailable"));
    try {
      renderPrompt();
      act(() => { pwa.onRegisteredSW!("/sw.js", { update } as unknown as ServiceWorkerRegistration); });
      expect(update).not.toHaveBeenCalled();
      online.mockReturnValue(true);
      fireEvent(window, new Event("online"));
      await waitFor(() => expect(update).toHaveBeenCalledTimes(1));
      expect(screen.getByRole("button", { name: "Restart to update" })).toBeEnabled();
    } finally {
      online.mockRestore();
    }
  });
});
