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