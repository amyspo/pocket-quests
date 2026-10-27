# Refactor Log

Record of each refactoring step: what moved, where it lives now, and ideas for later steps.

Extracted local-date, quest-sorting, and initial-storage helpers from `App.jsx` into `src/utils/questState.js` to separate quest-state setup from rendering and practice module imports/exports. Files changed: `src/App.jsx`, `src/utils/questState.js`, and this log. Checks: `npm run lint` and `npm run build` passed.

Extracted the daily progress panel and its calculations from `App.jsx` into `src/components/ProgressPanel.jsx` to give the progress display one clear component boundary. Files changed: `src/App.jsx`, `src/components/ProgressPanel.jsx`, and this log. Checks: `npm run lint` and `npm run build` passed.

Extracted quest-list and empty-state rendering from `App.jsx` into `src/components/QuestList.jsx` to separate conditional board contents and practice passing event handlers as props. Files changed: `src/App.jsx`, `src/components/QuestList.jsx`, and this log. Checks: `npm run lint` and `npm run build` passed.