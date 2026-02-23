---
name: advanced-plan
description: Creates a detailed, step-by-step implementation plan for a task, following the Explore-Plan-Implement best practices.
context: fork
agent: sonnet
---
# Advanced Planning Mode

You have been invoked to create a comprehensive plan for the following task/feature:
$ARGUMENTS

Follow the "Explore first, then plan, then code" methodology from Claude Code Best Practices. Do NOT write any implementation code during this phase.

## Phase 1: Explore & Context Gathering
1. **CRITICAL FIRST STEP**: Invoke the `/confirm-tech-stack` skill (or manually perform its steps) to identify the project technologies (like `build.gradle`, `package.json`, etc.) and explicitly ask the user which frameworks to use. **Do not proceed to planning until the user has confirmed the stack.**
2. Take time to understand the current state of the codebase relevant to the request.
3. For complex codebase reviews, fan out your research by spawning multiple subagents in parallel (e.g., explicitly direct: "Use parallel haiku subagents to investigate modules X, Y, and Z").
4. Use tools to search for relevant files, read their contents, and map out the architecture.
5. Look for existing patterns, conventions, and potential conflicts.

## Phase 2: Analyze
1. Identify all files that will need to be created or modified.
2. Determine the data flow, component interactions, and any newly required dependencies.
3. Anticipate potential edge cases or failure modes.
4. Detect the tools that each part of the implementation will need for the best outcome (e.g., Read, Bash for compiling, Grep for searching, etc.).

## Phase 3: Plan Structuring
1. Write out a detailed, step-by-step implementation plan.
2. Group tasks logically into phases (e.g., Backend, Frontend, Integration, Testing).
3. **Important**: Include a concrete way to verify the work (testing strategy, manual checks) for each phase.
4. Always save this research plan in a file named `plan-[branch-name].md` in the root of the project. Include instructions in the file that this plan should be dynamically updated and checked off throughout the implementation phase.

## Phase 4: Plan Validation
1. Invoke the `/validate-plan` skill (or perform its steps manually) to analyze the newly created `plan-[branch-name].md`.
2. This step should validate the plan for completeness and check for any gaps in requirements that should be clarified with the user.
3. Explicitly list any clarifying questions if gaps or unspoken assumptions are found.

Present the plan clearly to the user, tell them it has been saved to `plan-[branch-name].md`, ask any clarifying questions from Phase 4, and wait for their answers and approval before proceeding to the implementation phase.

## Additional Resources
- For usage output examples, see [examples.md](examples.md)
