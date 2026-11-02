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

  it("sorts quests by completion count, least completed first", () => {
    const sortedQuests = sortQuestsByProgress(quests);

    expect(sortedQuests.map((quest) => quest.name)).toEqual([
      "Read a chapter",
      "Take a little walk",
      "Tend to my plants",
    ]);
  });

  it("sorts quests with the same completion count alphabetically", () => {
    const questsWithTies = [
      { name: "Write in my journal", completionDates: ["2025-03-02"] },
      { name: "Draw for fun", completionDates: ["2025-03-03"] },
    ];

    const sortedQuests = sortQuestsByProgress(questsWithTies);

    expect(sortedQuests.map((quest) => quest.name)).toEqual([
      "Draw for fun",
      "Write in my journal",
    ]);
  });

  it("does not change the original quest order", () => {
    const originalOrder = quests.map((quest) => quest.name);

    sortQuestsByProgress(quests);

    expect(quests.map((quest) => quest.name)).toEqual(originalOrder);
  });
});
