# Development Workflow

In principle, proceed with Test-Driven Development (TDD) as advocated by Takuto Wada (t-wada).

## Red Phase (Test Creation)

- First, create tests based on the expected input and output.
- Do not write implementation code; only prepare the tests.
- Run the tests and confirm that they fail.
- Commit once you have confirmed that the tests are correct.

## Green Phase (Minimal Implementation)

- Proceed with the minimal implementation required to pass the tests.
- Do not modify the tests during implementation; keep fixing the code.
- Repeat until all tests pass.

## Refactor Phase (Improvement)

- Improve code quality while keeping all tests passing.
- Remove duplication, improve naming, and restructure as needed.
- After refactoring, confirm that all tests still pass.
