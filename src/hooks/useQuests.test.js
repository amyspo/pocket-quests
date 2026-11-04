// @vitest-environment jsdom

import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import useQuests from "./useQuests.js";
import { getLocalDateKey, STORAGE_KEY } from "../utils/questState.js";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

function renderUseQuests() {
  let latestValue;
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);

  function HookHarness() {
    latestValue = useQuests();
    return null;
  }

  act(() => {
    root.render(createElement(HookHarness));
  });

  return {
    get value() {
      return latestValue;
    },
    unmount() {
      act(() => {
        root.unmount();
      });
      container.remove();
    },
  };
}

function setSystemDate(year, month, day) {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(year, month - 1, day, 12));
}

function saveQuestState({ dayKey, quests, dailyGoal = 5, ...badgeState }) {
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      dayKey,
      quests,
      dailyGoal,
      ...badgeState,
    }),
  );
}

function focusApp() {
  act(() => {
    window.dispatchEvent(new Event("focus"));
  });
}

beforeEach(() => {
  window.localStorage.clear();
  vi.stubGlobal("crypto", {
    randomUUID: vi.fn(() => "quest-test-id"),
  });
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  document.body.innerHTML = "";
});

describe("useQuests", () => {
  it("creates, edits, completes, and deletes a quest", () => {
    const harness = renderUseQuests();
    const initialQuestCount = harness.value.quests.length;

    act(() => {
      harness.value.addQuest({ name: "Bake cookies", emoji: "🍪" });
    });

    expect(harness.value.quests).toHaveLength(initialQuestCount + 1);
    const createdQuest = harness.value.quests.find(
      (quest) => quest.id === "quest-test-id",
    );
    expect(createdQuest).toMatchObject({
      name: "Bake cookies",
      emoji: "🍪",
      completionDates: [],
    });

    act(() => {
      harness.value.editQuest(createdQuest.id, {
        name: "Bake oatmeal cookies",
        emoji: "🥣",
      });
    });

    expect(
      harness.value.quests.find((quest) => quest.id === createdQuest.id),
    ).toMatchObject({
      name: "Bake oatmeal cookies",
      emoji: "🥣",
      completionDates: [],
    });

    act(() => {
      harness.value.toggleQuestCompletion(createdQuest.id);
    });

    expect(
      harness.value.quests.find((quest) => quest.id === createdQuest.id)
        .completionDates,
    ).toContain(getLocalDateKey());

    act(() => {
      harness.value.deleteQuest(createdQuest.id);
    });

    expect(
      harness.value.quests.some((quest) => quest.id === createdQuest.id),
    ).toBe(false);

    harness.unmount();
  });

  it("persists quest changes and restores them after remounting", () => {
    const harness = renderUseQuests();

    act(() => {
      harness.value.setDailyGoal(7);
      harness.value.addQuest({
        name: "Stretch for five minutes",
        emoji: "🧘",
      });
    });

    const savedState = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    expect(savedState.dailyGoal).toBe(7);
    expect(savedState.unlockedBadges).toEqual([]);
    expect(savedState.goalMetDates).toEqual([]);
    expect(savedState.quests).toContainEqual(
      expect.objectContaining({
        id: "quest-test-id",
        name: "Stretch for five minutes",
        emoji: "🧘",
        completionDates: [],
      }),
    );

    harness.unmount();
    const reloadedHarness = renderUseQuests();

    expect(reloadedHarness.value.quests).toEqual(savedState.quests);
    expect(reloadedHarness.value.dailyGoal).toBe(7);
    expect(reloadedHarness.value.unlockedBadges).toEqual([]);
    expect(reloadedHarness.value.goalMetDates).toEqual([]);

    reloadedHarness.unmount();
  });

  it("counts repeated completions of the same quest on different days", () => {
    setSystemDate(2026, 3, 1);
    const quest = {
      id: "quest-one",
      name: "Read a chapter",
      emoji: "📖",
      completionDates: [],
    };
    saveQuestState({ dayKey: "2026-03-01", quests: [quest], dailyGoal: 5 });
    const harness = renderUseQuests();

    act(() => {
      harness.value.toggleQuestCompletion(quest.id);
    });

    vi.setSystemTime(new Date(2026, 2, 2, 12));
    focusApp();
    act(() => {
      harness.value.toggleQuestCompletion(quest.id);
    });

    const completedQuest = harness.value.quests[0];
    expect(completedQuest.completionDates).toEqual([
      "2026-03-01",
      "2026-03-02",
    ]);
    expect(harness.value.unlockedBadges).toContain("first-steps");
    expect(harness.value.goalMetDates).toEqual(["2026-03-01"]);

    const savedState = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    expect(savedState.unlockedBadges).toContain("first-steps");
    expect(savedState.goalMetDates).toEqual(["2026-03-01"]);

    harness.unmount();
    const reloadedHarness = renderUseQuests();
    expect(reloadedHarness.value.unlockedBadges).toContain("first-steps");
    expect(reloadedHarness.value.goalMetDates).toEqual(["2026-03-01"]);
    reloadedHarness.unmount();
  });

  it("does not revoke a completion badge when a completion is undone", () => {
    setSystemDate(2026, 3, 1);
    const quest = {
      id: "quest-one",
      name: "Read a chapter",
      emoji: "📖",
      completionDates: [],
    };
    saveQuestState({ dayKey: "2026-03-01", quests: [quest] });
    const harness = renderUseQuests();

    act(() => {
      harness.value.toggleQuestCompletion(quest.id);
      harness.value.toggleQuestCompletion(quest.id);
    });

    expect(harness.value.quests[0].completionDates).toEqual([]);
    expect(harness.value.unlockedBadges).toContain("first-steps");

    harness.unmount();
  });

  it("evaluates a day once and skips inactive days during rollover", () => {
    setSystemDate(2026, 3, 5);
    const quest = {
      id: "quest-one",
      name: "Read a chapter",
      emoji: "📖",
      completionDates: ["2026-03-01"],
    };
    saveQuestState({ dayKey: "2026-03-01", quests: [quest], dailyGoal: 5 });
    const harness = renderUseQuests();

    focusApp();
    expect(harness.value.goalMetDates).toEqual(["2026-03-01"]);
    expect(harness.value.unlockedBadges).toContain("a-good-day");

    focusApp();
    expect(harness.value.goalMetDates).toEqual(["2026-03-01"]);
    expect(
      JSON.parse(window.localStorage.getItem(STORAGE_KEY)).dayKey,
    ).toBe("2026-03-05");

    harness.unmount();
  });

  it("does not change an evaluated day after the daily goal changes", () => {
    setSystemDate(2026, 3, 2);
    const quests = [
      {
        id: "quest-one",
        name: "Read a chapter",
        emoji: "📖",
        completionDates: ["2026-03-01"],
      },
      {
        id: "quest-two",
        name: "Take a walk",
        emoji: "🚶",
        completionDates: [],
      },
    ];
    saveQuestState({
      dayKey: "2026-03-01",
      quests,
      dailyGoal: 2,
    });
    const harness = renderUseQuests();

    focusApp();
    expect(harness.value.goalMetDates).toEqual([]);

    act(() => {
      harness.value.setDailyGoal(1);
    });
    vi.setSystemTime(new Date(2026, 2, 3, 12));
    focusApp();

    expect(harness.value.goalMetDates).toEqual([]);
    expect(
      JSON.parse(window.localStorage.getItem(STORAGE_KEY)).dayKey,
    ).toBe("2026-03-03");

    harness.unmount();
  });

  it("preserves a successful evaluated day after the daily goal changes", () => {
    setSystemDate(2026, 3, 2);
    const quest = {
      id: "quest-one",
      name: "Read a chapter",
      emoji: "📖",
      completionDates: ["2026-03-01"],
    };
    saveQuestState({ dayKey: "2026-03-01", quests: [quest], dailyGoal: 5 });
    const harness = renderUseQuests();

    focusApp();
    expect(harness.value.goalMetDates).toEqual(["2026-03-01"]);

    act(() => {
      harness.value.setDailyGoal(2);
    });
    vi.setSystemTime(new Date(2026, 2, 3, 12));
    focusApp();

    expect(harness.value.goalMetDates).toEqual(["2026-03-01"]);
    expect(harness.value.unlockedBadges).toContain("a-good-day");

    harness.unmount();
  });

  it("rejects daily goals outside the supported range", () => {
    const harness = renderUseQuests();

    expect(() => harness.value.setDailyGoal(11)).toThrow(RangeError);

    harness.unmount();
  });
});
