import { describe, expect, it } from "vitest";
import {
  BADGES,
  getCompletionBadgeUnlocks,
  getDailyGoalBadgeUnlocks,
} from "./badges.js";

describe("badge definitions", () => {
  it("defines every badge with a stable id, condition, and locked hint", () => {
    expect(BADGES.map(({ id, name, threshold }) => [id, name, threshold])).toEqual([
      ["first-steps", "First Steps", 1],
      ["getting-into-it", "Getting Into It", 10],
      ["quest-enthusiast", "Quest Enthusiast", 20],
      ["quest-collector", "Quest Collector", 50],
      ["quest-master", "Quest Master", 100],
      ["a-good-day", "A Good Day", 1],
      ["finding-your-rhythm", "Finding Your Rhythm", 10],
      ["a-little-tradition", "A Little Tradition", 50],
    ]);
    expect(
      BADGES.every(
        ({ condition, hint }) =>
          typeof condition === "string" && typeof hint === "string" && hint,
      ),
    ).toBe(true);
  });
});

describe("getCompletionBadgeUnlocks", () => {
  it.each(BADGES.filter((badge) => badge.type === "completion"))(
    "unlocks $name at its threshold, but not below it",
    (badge) => {
      const belowThreshold = Array.from(
        { length: badge.threshold - 1 },
        (_, index) => `day-${index}`,
      );
      const atThreshold = [...belowThreshold, "threshold-day"];

      expect(
        getCompletionBadgeUnlocks(
          [{ completionDates: belowThreshold }],
          [],
        ),
      ).not.toContain(badge.id);
      expect(
        getCompletionBadgeUnlocks([{ completionDates: atThreshold }], []),
      ).toContain(badge.id);
    },
  );

  it("counts completion history across all quests", () => {
    const quests = [
      { completionDates: ["day-1", "day-2"] },
      { completionDates: ["day-3"] },
    ];

    expect(getCompletionBadgeUnlocks(quests, [])).toContain("first-steps");
  });

  it("does not return badges that are already unlocked", () => {
    expect(
      getCompletionBadgeUnlocks(
        [{ completionDates: ["day-1"] }],
        ["first-steps"],
      ),
    ).not.toContain("first-steps");
  });
});

describe("getDailyGoalBadgeUnlocks", () => {
  it.each(BADGES.filter((badge) => badge.type === "daily-goal"))(
    "unlocks $name at its threshold, but not below it",
    (badge) => {
      const belowThreshold = Array.from(
        { length: badge.threshold - 1 },
        (_, index) => `day-${index}`,
      );
      const atThreshold = [...belowThreshold, "threshold-day"];

      expect(getDailyGoalBadgeUnlocks(belowThreshold, [])).not.toContain(
        badge.id,
      );
      expect(getDailyGoalBadgeUnlocks(atThreshold, [])).toContain(badge.id);
    },
  );

  it("does not return badges that are already unlocked", () => {
    expect(
      getDailyGoalBadgeUnlocks(["day-1"], ["a-good-day"]),
    ).not.toContain("a-good-day");
  });
});
