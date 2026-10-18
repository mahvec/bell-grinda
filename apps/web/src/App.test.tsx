import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { App } from "./App";
import { db } from "./persistence/database";
import { store } from "./state/store";

describe("BellGrinda app bootstrap", () => {
  beforeEach(async () => {
    await db.delete();
    db.open();
  });

  it("shows onboarding when no local profile exists", async () => {
    render(<Provider store={store}><MemoryRouter><App /></MemoryRouter></Provider>);
    expect(await screen.findByRole("heading", { name: /One bell\.\s*A stronger you\./ })).toBeInTheDocument();
  });
});
