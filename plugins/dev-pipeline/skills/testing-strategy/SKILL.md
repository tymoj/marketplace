---
name: testing-strategy
description: Universal testing principles applicable to all technology stacks. For stack-specific conventions, use the dedicated testing-strategy-java, testing-strategy-node, or testing-strategy-python skills.
user-invocable: false
---

Universal testing principles — apply these regardless of stack.

## AAA Pattern
Every test follows: **Arrange** (setup), **Act** (execute), **Assert** (verify).

## Test Behavior, Not Implementation
- Test what the code does, not how it does it
- Tests should survive refactoring if behavior is unchanged
- Avoid mocking internal details — mock at boundaries (DB, HTTP, filesystem)

## One Logical Assertion Per Test
- Each test verifies one behavior or scenario
- Multiple `assert` calls are fine if they verify aspects of the same behavior
- If a test name needs "and", split it into two tests

## Edge Cases
Always test: null/nil/None, empty collections, boundary values (0, -1, MAX_INT), error paths, concurrent access (where relevant).

## Deterministic Tests
- No random data without seeding
- No time-dependent assertions (use clock mocking)
- No dependency on test execution order
- No shared mutable state between tests

## Test Data
- Use factories or builders, not raw constructors
- Create minimal data — only what's needed for the assertion
- Avoid shared fixtures that make tests interdependent

## Naming
Test names should describe the scenario, not the method:
- Good: `should_returnEmpty_when_noOrdersExist`
- Bad: `testGetOrders`

## Test Pyramid
- Many unit tests (fast, isolated)
- Fewer integration tests (slower, real dependencies)
- Few E2E tests (slowest, full stack)
