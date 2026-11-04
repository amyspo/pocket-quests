# Badges Screen

## Purpose

The badges screen gives users a visual overview of their achievements in Pocket Quests. It should make progress feel rewarding and encourage consistency without creating pressure.

Badges are permanent collectibles. Once unlocked, they remain unlocked, even if the user later undoes completions.

Badges are a simple add-on and not the app's main reward loop. Instant gratification is already handled by the daily progress bar. Badges are a quieter reward that can be discovered when the user opens the app the next day.

## Navigation

- A pixel-art trophy serves as the button to access the badges screen.
- The trophy button is accessible from the main screen.
- The badges screen has a simple way to return to the main screen.

## Layout and Visual Design

- Display badges in a simple grid.
- Each badge is represented by pixel art.
- Unlocked badges display their artwork clearly.
- Locked badges appear as silhouettes or otherwise visually obscured versions of their artwork.
- Every locked badge displays a short hint about how to unlock it. The hint is a short version of the badge's unlock condition.
- Keep the layout simple and let the pixel-art badges be the main visual focus.
- The pixel-art trophy and badge artwork will be created by the developer. Until the artwork is ready, use a single generic placeholder for all badges.

## Badge System

Badges are awarded automatically when their conditions are met. Users never need to claim them manually.

Unlocked badges are persisted. Once a badge is unlocked, it is stored as unlocked and is never re-locked or re-evaluated, regardless of later changes to the user's completions.

There are two types of achievements.

### 1. Quest Completion Milestones

These badges reward users for completing quests.

Badge Name | Badge milestone | Unlock condition |
|---|---|---|
First Steps | 1 completion | Complete any quest once |
Getting Into It | 10 completions | Complete quests 10 times in total |
Quest Enthusiast | 20 completions | Complete quests 20 times in total |
Quest Collector | 50 completions | Complete quests 50 times in total |
Quest Master | 100 completions | Complete quests 100 times in total |

Rules:

- Each individual completion counts, including completing the same quest on different days and completing more quests after the daily goal has been reached.
- A quest can only be completed once per day. It resets the next day.
- Users can undo a completion by clicking the quest again. Undoing removes that completion from the total count.
- Because unlocked badges are permanent, undoing a completion never removes a badge that was already unlocked. Badges are checked and unlocked whenever a quest is completed.

### 2. Daily Goal Milestones

These badges reward consistency by tracking the number of days on which the user's daily goal was achieved.

Badge Name | Badge milestone | Unlock condition |
|---|---|---|
A Good Day | 1 day | Achieve the daily goal on 1 day |
Finding Your Rhythm| 10 days | Achieve the daily goal on 10 distinct days |
A Little Tradition | 50 days | Achieve the daily goal on 50 distinct days |

Rules:

- A day only counts once, regardless of how many quests are completed beyond the daily goal.
- Days are based on the device's local date.

## Daily Goal Evaluation

Daily goal achievements are evaluated after a day has ended, not while it is still in progress. This prevents a day from counting prematurely if the user temporarily reaches their goal and then undoes completions.

- The evaluation happens when the app detects that a new day has started. This is the same moment the quests reset.
- The new day may be several days after the last time the app was used. This is expected.
- Only days on which the user interacted with the app need to be evaluated. Days without any activity are skipped and do not count as goal-met days.
- Once a day has been evaluated, its result is final and must be preserved.
- Changing the daily goal applies immediately but must not retroactively change the goal or achievement status of previously evaluated days.
- Newly unlocked badges are unlocked as part of this evaluation, so the user typically discovers them when opening the app the next day.

## Data and Persistence

- Badge unlocks must persist between sessions.
- Use the existing localStorage setup (`pocket-quests`).
- Use the existing `completionDates` data for the completion milestone count.
- Add persisted `goalMetDates` data to track which distinct days the daily goal was achieved.

The exact data structure and how daily goal history is stored are defined separately in the implementation prompt.

## Future Possibilities

- Secret badges with hidden unlock conditions.
- More badge categories and milestones.
- A small visual notification when a new badge is unlocked.
- Progress counters on locked badges (e.g. "7/10").