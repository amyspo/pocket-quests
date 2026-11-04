import { sampleQuests } from "../data/sampleQuests.js";

export const STORAGE_KEY = "pocket-quests";
export const DEFAULT_DAILY_GOAL = 5;
export const MIN_DAILY_GOAL = 1;
export const MAX_DAILY_GOAL = 10;

function getDefaultBadgeState() {
  return {
    unlockedBadges: [],
    goalMetDates: [],
  };
}

export function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function sortQuestsByProgress(quests) {
  return [...quests].sort((firstQuest, secondQuest) => {
    const completionDifference =
      firstQuest.completionDates.length - secondQuest.completionDates.length;

    return (
      completionDifference || firstQuest.name.localeCompare(secondQuest.name)
    );
  });
}

function copySampleQuests() {
  return sampleQuests.map((quest) => ({
    ...quest,
    completionDates: [...quest.completionDates],
  }));
}

function isValidQuest(quest) {
  return (
    quest &&
    typeof quest.id === "string" &&
    typeof quest.name === "string" &&
    typeof quest.emoji === "string" &&
    Array.isArray(quest.completionDates) &&
    quest.completionDates.every((date) => typeof date === "string")
  );
}

export function loadInitialState() {
  const today = getLocalDateKey();

  try {
    const savedState = localStorage.getItem(STORAGE_KEY);

    if (!savedState) {
      return {
        dayKey: today,
        quests: sortQuestsByProgress(copySampleQuests()),
        dailyGoal: DEFAULT_DAILY_GOAL,
        ...getDefaultBadgeState(),
      };
    }

    const parsedState = JSON.parse(savedState);

    if (
      !parsedState ||
      typeof parsedState.dayKey !== "string" ||
      !Array.isArray(parsedState.quests) ||
      !parsedState.quests.every(isValidQuest) ||
      (parsedState.unlockedBadges !== undefined &&
        (!Array.isArray(parsedState.unlockedBadges) ||
          !parsedState.unlockedBadges.every(
            (badgeId) => typeof badgeId === "string",
          ))) ||
      (parsedState.goalMetDates !== undefined &&
        (!Array.isArray(parsedState.goalMetDates) ||
          !parsedState.goalMetDates.every((date) => typeof date === "string"))) ||
      (parsedState.dailyGoal !== undefined &&
        (!Number.isInteger(parsedState.dailyGoal) ||
          parsedState.dailyGoal < MIN_DAILY_GOAL ||
          parsedState.dailyGoal > MAX_DAILY_GOAL))
    ) {
      throw new Error("Saved quest data has an unexpected format.");
    }

    const quests =
      parsedState.dayKey === today
        ? parsedState.quests
        : sortQuestsByProgress(parsedState.quests);

    return {
      dayKey: parsedState.dayKey,
      quests,
      dailyGoal: parsedState.dailyGoal ?? DEFAULT_DAILY_GOAL,
      unlockedBadges: parsedState.unlockedBadges ?? [],
      goalMetDates: parsedState.goalMetDates ?? [],
    };
  } catch (error) {
    console.error(
      "Could not load saved quests. Starting with sample quests.",
      error,
    );
    return {
      dayKey: today,
      quests: sortQuestsByProgress(copySampleQuests()),
      dailyGoal: DEFAULT_DAILY_GOAL,
      ...getDefaultBadgeState(),
    };
  }
}
