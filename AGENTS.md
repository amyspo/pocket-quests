# AGENTS.md

Pocket Quests is a React app that turns everyday tasks into small, manageable quests to make getting things done feel more motivating and rewarding. I'm a junior developer learning React.

## Project Context

- Read `README.md` for an overview of Pocket Quests.
- Read `docs/PROJECT_BRIEF.md` before implementing features.
- Follow the principles in `docs/AI_WORKFLOW.md`.

## Tech Stack and Commands

- React with JavaScript (not TypeScript), plain CSS
- Install: `npm install`
- Start the app: `npm run dev`
- Lint: `npm run lint`
- Build: `npm run build`

## Working Principles

- Work incrementally and focus on the current task.
- For changes touching more than 2-3 files, explain your approach first.
- Prefer simple, readable solutions over unnecessary abstractions.
- Follow the existing project structure and conventions.
- Do not add dependencies unless needed; explain why before adding them.
- Do not modify unrelated files or features.
- Ask for clarification when requirements are ambiguous instead of
  making significant assumptions.

## Code Style

- Function components and hooks only
- One component per file, PascalCase file names (`QuestCard.jsx`)
- Semantic HTML over generic `<div>`s
- Clear, descriptive names for variables and functions

## Styling and Visual Design

- Prefer clear visual hierarchy, readable text, and uncluttered layouts.
- Use plain CSS and shared design tokens to maintain consistent styling.
- Avoid adding a UI component library, ask my permission, if you want to use one.

## Learning and Review

- Explain unfamiliar concepts and important implementation decisions.
- Help me understand the code rather than treating it as a black box.
- Summarise the changes made and tell me how I can test them.

## Validation

Before saying a task is done:
- Run `npm run lint` and fix any errors
- Run `npm run build` and confirm it succeeds
- Report which checks were run and whether they passed
- Never claim that something was tested if it was not

## Implementation Guidelines

- Define shared configuration values as named constants rather than repeating magic numbers. Keep values that may become user settings easy to change.
- Keep business logic separate from presentation where practical, without introducing unnecessary abstractions.
- Handle date-dependent behavior using the user's local calendar date.
- Account for the app being inactive when date-dependent state needs to be refreshed, such as when the browser window regains focus.
- Keep existing ordering stable when state changes unless the requirements explicitly call for reordering.
- Before implementing behavior with important edge cases, explain the proposed approach and clarify any unresolved requirements.
- Prefer accessible, semantic controls and provide clear feedback for user actions.