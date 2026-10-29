import { describe, it, expect } from "vitest";
import { getLocalDateKey } from "./questState.js";
import { sortQuestsByProgress } from "./questState.js";

describe("getLocalDateKey", () => {
  it("takes a date and returns a string", () => {
    expect(getLocalDateKey(new Date(2026, 2, 5))).toBe("2026-03-05");
  });

  it("keeps two-digit months and days as they are", () => {
    expect(getLocalDateKey(new Date(2026, 11, 25))).toBe("2026-12-25");
  });
});

describe("sortQuestsByProgress", () => {
  const quests = [
    {
      name: "Tend to my plants",
      completionDates: ["2025-03-02", "2025-03-08"],
    },
    { name: "Take a little walk", completionDates: ["2025-03-04"] },
    { name: "Read a chapter", completionDates: [] },
  ];
});
