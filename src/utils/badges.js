export const BADGES = [
  {
    id: "first-steps",
    name: "First Steps",
    type: "completion",
    threshold: 1,
    condition: "Complete any quest once",
    hint: "Complete any quest once.",
  },
  {
    id: "getting-into-it",
    name: "Getting Into It",
    type: "completion",
    threshold: 10,
    condition: "Complete quests 10 times in total",
    hint: "Complete quests 10 times.",
  },
  {
    id: "quest-enthusiast",
    name: "Quest Enthusiast",
    type: "completion",
    threshold: 20,
    condition: "Complete quests 20 times in total",
    hint: "Complete quests 20 times.",
  },
  {
    id: "quest-collector",
    name: "Quest Collector",
    type: "completion",
    threshold: 50,
    condition: "Complete quests 50 times in total",
    hint: "Complete quests 50 times.",
  },
  {
    id: "quest-master",
    name: "Quest Master",
    type: "completion",
    threshold: 100,
    condition: "Complete quests 100 times in total",
    hint: "Complete quests 100 times.",
  },
  {
    id: "a-good-day",
    name: "A Good Day",
    type: "daily-goal",
    threshold: 1,
    condition: "Achieve the daily goal on 1 day",
    hint: "Achieve your daily goal on 1 day.",
  },
  {
    id: "finding-your-rhythm",
    name: "Finding Your Rhythm",
    type: "daily-goal",
    threshold: 10,
    condition: "Achieve the daily goal on 10 distinct days",
    hint: "Achieve your daily goal on 10 days.",
  },
  {
    id: "a-little-tradition",
    name: "A Little Tradition",
    type: "daily-goal",
    threshold: 50,
    condition: "Achieve the daily goal on 50 distinct days",
    hint: "Achieve your daily goal on 50 days.",
  },
];

function getBadgeUnlocks(type, progress, unlockedBadges) {
  const unlockedBadgeIds = new Set(unlockedBadges);

  return BADGES.filter(
    (badge) =>
      badge.type === type &&
      badge.threshold <= progress &&
      !unlockedBadgeIds.has(badge.id),
  ).map((badge) => badge.id);
}

export function getCompletionBadgeUnlocks(quests, unlockedBadges) {
  const completionCount = quests.reduce(
    (total, quest) => total + quest.completionDates.length,
    0,
  );

  return getBadgeUnlocks("completion", completionCount, unlockedBadges);
}

export function getDailyGoalBadgeUnlocks(goalMetDates, unlockedBadges) {
  return getBadgeUnlocks("daily-goal", goalMetDates.length, unlockedBadges);
}
