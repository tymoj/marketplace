---
name: implement-plan
description: Implements a previously agreed-upon plan, includes writing tests and course-correcting.
context: fork
agent: sonnet
---
# Implement Plan

Implement the following plan or task:
$ARGUMENTS

Follow best practices for implementation:
1. First, locate and read the `plan-[branch-name].md` file to understand the tasks.
2. Break down the plan into parallelizable tasks where possible. Spawn multiple isolated subagents to independently execute portions of the plan concurrently (e.g., "Use a subagent with 'Bash' and 'Edit' tools to build the API, while another subagent builds the frontend"). Ensure their scopes do not conflict.
3. For tasks that must be sequential, execute them step by step.
4. Ensure subagents are assigned the exact tools detected during the planning phase to guarantee the best outcome.
5. Provide specific context when updating or creating files or interacting with subagents.
6. Write tests for the new code or changes to verify your work. Use a subagent for running the test suite and fixing any failures, course-correcting early and often.
7. Constantly update `plan-[branch-name].md` throughout the implementation to check off completed tasks or adjust it if new challenges arise.
8. Make sure to commit changes logically if requested, with descriptive commit messages.
