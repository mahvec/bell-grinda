import type { PainSeverity } from "@bellgrinda/domain";

export type PainDecision = {
  action: "monitor" | "substitute" | "skip" | "end_session";
  mustStopMovement: boolean;
  guidance: string;
};

export function decidePainAction(severity: PainSeverity, hasApprovedSubstitute: boolean): PainDecision {
  if (severity === "severe") {
    return {
      action: "end_session",
      mustStopMovement: true,
      guidance: "Stop the movement and end this workout. Seek appropriate medical or professional evaluation; BellGrinda cannot diagnose pain."
    };
  }
  if (severity === "moderate") {
    return {
      action: hasApprovedSubstitute ? "substitute" : "skip",
      mustStopMovement: true,
      guidance: hasApprovedSubstitute
        ? "Stop this exercise. Use the approved substitute only if it feels comfortable and controlled."
        : "Stop and skip this exercise for today."
    };
  }
  return {
    action: "monitor",
    mustStopMovement: false,
    guidance: "Pause and reassess. Continue only if the movement feels comfortable and remains technically controlled."
  };
}
