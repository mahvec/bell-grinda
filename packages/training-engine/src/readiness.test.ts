import { describe, expect, it } from "vitest";
import { classifyReadiness } from "./readiness";

describe("classifyReadiness", () => {
  it("classifies strong inputs as green", () => {
    const result = classifyReadiness({ energy: "high", sleep: "good", soreness: "none", pain: "none", football: "none" });
    expect(result).toMatchObject({ score: 100, status: "green" });
  });

  it("forces red when moderate pain is reported", () => {
    const result = classifyReadiness({ energy: "high", sleep: "good", soreness: "none", pain: "moderate", football: "none" });
    expect(result.status).toBe("red");
    expect(result.score).toBeLessThan(50);
    expect(result.reasonCodes).toContain("SAFETY_MODERATE_PAIN");
  });

  it("forces yellow on a competition day", () => {
    const result = classifyReadiness({ energy: "high", sleep: "good", soreness: "none", pain: "none", football: "competition" });
    expect(result.status).toBe("yellow");
    expect(result.score).toBeLessThan(75);
  });
});
