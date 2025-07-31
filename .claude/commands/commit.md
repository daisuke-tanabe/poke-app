---
allowed-tools: [Bash, Read, Edit, TodoWrite]
description: Analyze uncommitted files and create commits at an appropriate granularity for logically related changes.
---

# commit.md

## Execution Steps

1. **Create a Work Plan**
    - List necessary tasks using the TodoWrite tool
    - Clarify each step: quality check, code cleanup, and commit preparation

2. **Quality Check (Required Before Commit)**
    - Run quality checks defined by the project
    - Common examples:
        - Linter/Formatter (ESLint, Prettier, ktlint, rustfmt, etc.)
        - Type checking (TypeScript, Flow, etc.)
        - Test execution (Jest, pytest, JUnit, etc.)
    - Check project-specific commands such as `make lint`, `npm run check`, etc.

3. **Check Uncommitted Status**
    - List changed files with `git status`
    - Check change statistics with `git diff --stat`
    - Analyze specific changes with `git diff`

4. **Group Changes**
    - Categorize logically: feature addition, bug fix, refactoring, style fix, etc.
    - Group related files together
    - Remove unnecessary debug code and comments

5. **Commit at Appropriate Granularity**
    - Create independent commits for each group
    - Write messages in Conventional Commits format
    - Add clear explanations in Japanese
    - Principle: 1 commit = 1 logical change

6. **Ensure Quality**
    - Confirm that lefthook pre-commit hooks are executed
    - Ensure commit message validation passes
    - Confirm a clean state with final `git status`

7. **Consider Updating Project Memory**
    - Consider adding technical issues and solutions found during work to `CLAUDE.md`
    - New error patterns, library usage, configuration notes, etc.
    - Accumulate knowledge to improve future development efficiency

## Commit Message Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer]
```

- type (required): Indicates the category of the change in the code (e.g., feat, fix, docs, style, etc.).
- scope (optional): Defines the area of the code that was changed (e.g., core, api, ui).
- description (required): A short phrase summarizing the change (aim for around 50 characters).
- body (optional): Provides a more detailed description of the change if necessary.
- footer (optional): Used to add additional information like "BREAKING CHANGE" or referencing issues.

## Example Execution

1. Run code lint/format
2. Run type check (if applicable)
3. Run tests
4. Remove unnecessary comments and debug code
5. Check `git status` and prepare for commit
6. Consider updating project memory

## Notes

- **Always perform quality checks before committing**
- If tests fail, check if they are related tests
- Resolve errors and warnings as much as possible before committing
- Properly escape paths containing special characters
- Check project-specific build tools and commands (Makefile, package.json, build.gradle, etc.)