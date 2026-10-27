# AI-Assisted Development Workflow

## Purpose

This document describes how AI is used during the development of Pocket Quests and how AI-generated work is reviewed and validated.

## Working Principles

- **Understand before accepting:** Review AI-generated code and ask questions about unfamiliar concepts.
- **Work incrementally:** Break features into small, manageable tasks instead of asking AI to build everything at once.
- **Keep ownership:** Make the final decisions about features, implementation and code changes.
- **Verify changes:** Run the application and relevant checks after changes.
- **Use version control:** Review changes before committing and keep commits focused.
- **Learn from the process:** Document important lessons and decisions when they are useful for future work.

## Development Process

1. Define a small task and its expected outcome.
2. Provide the AI agent with the relevant project context.
3. Review the proposed changes and ask questions where needed.
4. Test the implementation and check for unintended changes.
5. Commit the changes when they are ready.

## Development Notes

The first prompt was a success. Working with a home screen spec, project brief and agent.md worked great. The only thing that didn't work, for me, was the styling of the application. It looked very boring and generic. But the functionality was great. There were no major bugs. Even edge cases were considered and implemented. I am really happy with the outcome. 

## Next steps

I want to work on refactoring the code before moving on to new features. The App.jsx is pretty long and a bit hard to read, so I want to seperate a bit of the logic, to make everything easier to understand.
