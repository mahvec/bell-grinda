import { describe, expect, it } from "vitest";
import { decidePainAction } from "./pain";

describe("pain safety decisions", () => {
  it("stops moderate discomfort and chooses an approved substitute", () => {
    expect(decidePainAction("moderate", true)).toMatchObject({ action: "substitute", mustStopMovement: true });
  });

  it("skips moderate discomfort when no substitute is approved", () => {
    expect(decidePainAction("moderate", false)).toMatchObject({ action: "skip", mustStopMovement: true });
  });

  it("always ends the session for severe discomfort", () => {
    expect(decidePainAction("severe", true)).toMatchObject({ action: "end_session", mustStopMovement: true });
  });
});
