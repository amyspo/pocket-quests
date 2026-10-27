# Refactor Log

Record of each refactoring step: what moved, where it lives now, and ideas for later steps.

Extracted local-date, quest-sorting, and initial-storage helpers from `App.jsx` into `src/utils/questState.js` to separate quest-state setup from rendering and practice module imports/exports. Files changed: `src/App.jsx`, `src/utils/questState.js`, and this log. Checks: `npm run lint` and `npm run build` passed.