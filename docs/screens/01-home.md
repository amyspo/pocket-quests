
# Home Screen

## Layout and Structure

- Display a daily greeting, such as "Hello, traveler", a progress summary, and the quest list.
- Keep the quest list scrollable when it exceeds the available space.
- Use a mobile-first responsive layout that also works on desktop.
- When there are no quests, display an empty state with the message "Add quests to start your journey."

## Quest Cards

- Each quest has a user-selected emoji.
- Each quest card provides a one-tap action to mark the quest as completed.
- A completed quest shows a checkmark, a muted background, and a brief scale animation when completed.

## Quest Completion

- A quest can be completed at most once per local calendar day.
- Tapping a completed quest removes today's completion and restores its incomplete styling.
- Quests can be completed again on subsequent calendar days.
- Preserve completion history so lifetime progress can be calculated.

## Quest Ordering

- Sort quests by lifetime completion count, with the least-completed quests first.
- Break ties alphabetically by quest name.
- Keep the order stable throughout the day; completing a quest should not immediately move it to a different position.
- Recalculate the order when a new local calendar day begins.
- Newly created quests should be added without reordering existing quests during the current day.
- Deleting a quest removes it from the list.

## Progress Summary

- The daily goal is the number of available quests, up to a maximum of 5.
- If the user has fewer than 5 quests, the daily goal equals their total number of quests.
- If the user has 5 or more quests, the daily goal is 5.
- Update the daily goal when quests are added or deleted.
- Display "X of Y quests done today" and a progress bar, where Y is the daily goal.
- Displayed progress must never exceed the daily goal.
- When there is no progress, show a neutral message such as "Ready when you are."
- Never display missed days, broken streaks, or other negative progress messages.
- When the daily goal is reached, fill the progress bar and display a special celebratory message.

## Quest Management Entry Points

- Provide an entry point for creating a quest, which opens a modal.
- Provide a separate management modal for editing and deleting existing quests.
- Before deleting a quest, ask the user to confirm and warn that its completion history will be permanently lost.
- Keep quest completion separate from quest management so completing a quest remains a one-tap action.

## Out of Scope

- Streaks, reminders, or notifications.
- Drag-to-reorder quests.
- Quest categories or filtering.
- Features outside the agreed MVP scope.
