import { readinessInputSchema, type ReadinessInputSubmission, type ReadinessResult } from "@bellgrinda/domain";

const scoreMaps = {
  energy: { high: 100, normal: 80, low: 50, very_low: 25 },
  sleep: { excellent: 100, good: 100, okay: 75, poor: 45, very_poor: 25 },
  soreness: { none: 100, mild: 80, moderate: 50, severe: 20 }
} as const;

export function classifyReadiness(rawInput: ReadinessInputSubmission): ReadinessResult {
  const input = readinessInputSchema.parse(rawInput);
  const baseScore = Math.round(
    (scoreMaps.energy[input.energy] + scoreMaps.sleep[input.sleep] + scoreMaps.soreness[input.soreness]) / 3
  );
  const reasons: string[] = [];

  if (input.pain === "severe") {
    return {
      score: Math.min(baseScore, 30),
      status: "red",
      reasonCodes: ["SAFETY_SEVERE_PAIN"],
      guidance: "Do not train through severe pain. Stop and consider professional evaluation.",
      input
    };
  }

  if (input.pain === "moderate") reasons.push("SAFETY_MODERATE_PAIN");
  if (input.soreness === "severe") reasons.push("READINESS_SEVERE_SORENESS");
  if (input.energy === "very_low") reasons.push("READINESS_VERY_LOW_ENERGY");
  if (input.football === "competition") reasons.push("FOOTBALL_COMPETITION_DAY");
  if (input.football === "high_intensity") reasons.push("FOOTBALL_HIGH_INTENSITY_DAY");
  if (input.sleep === "poor" && ["moderate", "severe"].includes(input.soreness)) {
    reasons.push("READINESS_POOR_SLEEP_HIGH_SORENESS");
  }
  if (input.sleep === "poor" || input.sleep === "very_poor") reasons.push("READINESS_POOR_SLEEP");
  if (input.soreness === "moderate") reasons.push("READINESS_MODERATE_SORENESS");
  if ((input.sorenessLocations ?? []).some((location) => ["hip", "quadriceps", "hamstring", "knee", "calf", "ankle", "lower_back"].includes(location))) reasons.push("READINESS_LOWER_BODY_SORENESS");
  if ((input.availableMinutes ?? 40) < 40) reasons.push(`TIME_LIMIT_${input.availableMinutes ?? 40}`);

  const forcedRed = input.pain === "moderate" || input.soreness === "severe";
  const forcedYellow =
    input.football === "competition" ||
    input.football === "high_intensity" ||
    input.sleep === "poor" ||
    input.sleep === "very_poor" ||
    reasons.includes("READINESS_POOR_SLEEP_HIGH_SORENESS");
  const status = forcedRed ? "red" : forcedYellow ? "yellow" : baseScore >= 75 ? "green" : baseScore >= 50 ? "yellow" : "red";

  if (reasons.length === 0) reasons.push(`READINESS_SCORE_${status.toUpperCase()}`);

  return {
    score: forcedRed ? Math.min(baseScore, 49) : forcedYellow ? Math.min(baseScore, 74) : baseScore,
    status,
    reasonCodes: reasons,
    guidance:
      status === "green"
        ? "Train as planned and keep technique clean."
        : status === "yellow"
          ? "Use the reduced session and leave repetitions in reserve."
          : "Choose recovery work or rest. Training load cannot be upgraded today.",
    input
  };
}
