import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getExerciseMedia } from "../media/exerciseMedia";
import { ExerciseDemo } from "./ExerciseDemo";

describe("ExerciseDemo", () => {
  it("loads media only after the user opens the demonstration", () => {
    const media = getExerciseMedia("skipping")!;
    render(<ExerciseDemo media={media} exerciseName="Skipping rope" />);

    expect(screen.queryByLabelText("Skipping rope video demonstration")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /watch demo/i }));
    expect(screen.getByLabelText("Skipping rope video demonstration")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ketut Subiyanto" })).toHaveAttribute("href", media.sourcePageUrl);
  });

  it("keeps written guidance available when playback fails", () => {
    render(<ExerciseDemo media={getExerciseMedia("skipping")!} exerciseName="Skipping rope" />);
    fireEvent.click(screen.getByRole("button", { name: /watch demo/i }));
    fireEvent.error(screen.getByLabelText("Skipping rope video demonstration"));
    expect(screen.getByText("Use the written cues and keep your movement controlled.")).toBeInTheDocument();
  });

  it("shows a transparent coaching note when the live footage uses a related variation", () => {
    render(<ExerciseDemo media={getExerciseMedia("one-arm-row")!} exerciseName="Supported one-arm row" />);
    fireEvent.click(screen.getByRole("button", { name: /watch demo/i }));
    expect(screen.getByText(/keep one hand supported/i)).toBeInTheDocument();
  });

  it("applies slow motion and unmounts the player when closed", () => {
    render(<ExerciseDemo media={getExerciseMedia("skipping")!} exerciseName="Skipping rope" />);
    fireEvent.click(screen.getByRole("button", { name: /watch demo/i }));
    fireEvent.change(screen.getByLabelText("Playback speed"), { target: { value: "0.5" } });
    expect((screen.getByLabelText("Skipping rope video demonstration") as HTMLVideoElement).playbackRate).toBe(0.5);
    fireEvent.click(screen.getByRole("button", { name: "Close exercise demonstration" }));
    expect(screen.queryByLabelText("Skipping rope video demonstration")).not.toBeInTheDocument();
  });
});
