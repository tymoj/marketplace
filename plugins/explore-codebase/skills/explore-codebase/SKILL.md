---
name: explore-codebase
description: Explores the codebase to gather context for a specific task or feature without making changes.
allowed-tools: Read, Grep, Glob, view_file, codebase_search, grep_search, list_dir
context: fork
agent: haiku
---
# Explore Mode

Explore the codebase to understand how to implement or address the following task:
$ARGUMENTS

1. Search for relevant files, functions, and components.
2. Read the source code to understand existing patterns, system flows, and state management.
3. Summarize your findings and explain how the codebase currently works in relation to the task.
4. Identify any potential challenges or areas that need careful consideration.
5. Do not make any code changes or propose a complete plan yet; just focus on gathering context.
