import { afterEach, describe, expect, it, vi } from "vitest";
import { sampleQuests } from "../data/sampleQuests.js";
import {
  getLocalDateKey,
  loadInitialState,
  sortQuestsByProgress,
  STORAGE_KEY,
} from "./questState.js";

afterEach(() => {
  vi.unstubAllGlobals();
});

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

describe("loadInitialState", () => {
  it("uses sorted sample quests when there is no saved state", () => {
    const getItem = vi.fn().mockReturnValue(null);
    vi.stubGlobal("localStorage", { getItem });

    const state = loadInitialState();

    expect(getItem).toHaveBeenCalledWith(STORAGE_KEY);
    expect(state.dayKey).toBe(getLocalDateKey());
    expect(state.quests.map((quest) => quest.id)).toEqual(
      sortQuestsByProgress(sampleQuests).map((quest) => quest.id),
    );
    expect(state.quests).not.toBe(sampleQuests);
    expect(state.quests[0].completionDates).not.toBe(
      sampleQuests.find((quest) => quest.id === state.quests[0].id)
        .completionDates,
    );
  });
});
