---
name: validate-plan
description: Validates a structured implementation plan and checks for any gaps in requirements that should be clarified with the user.
context: fork
agent: haiku
---
# Plan Validation

Analyze the following implementation plan for completeness and potential gaps in requirements:
$ARGUMENTS

1. **Check for completeness**: Read the implementation plan (usually found in `plan-[branch-name].md`). Does the plan cover all aspects of the feature or task requested by the user, including edge cases, failure modes, and error handling?
2. **Identify implicit assumptions**: Highlight any assumptions made in the plan about user preferences, system behaviors, dependencies, or unstated requirements.
3. **Verify testing strategy**: Ensure that clear, actionable testing or verification steps exist for each phase as requested by the user.
4. **Clarify with the user**: If there are any gaps, ambiguities, or unspoken requirements (e.g., specific error messages, performance targets, unknown dependencies), explicitly list questions for the user.
5. **Pause and Ask**: Ask the user to clarify these points before the implementation phase begins.
6. **Important**: Wait for the user's answers and update the plan file accordingly with their clarifications.
