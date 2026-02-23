---
name: confirm-tech-stack
description: Identifies the technologies used in the current project and asks the user to confirm which ones to use for a specific task.
context: fork
agent: haiku
---
# Tech Stack Verification

Before proceeding with the implementation of: $ARGUMENTS

1. Analyze the project up front by checking configuration/dependency files (e.g., `package.json`, `requirements.txt`, `build.gradle`, `build.gradle.kts`, `docker-compose.yml`, or `.claude/skills`) to identify the main programming languages, frameworks, internal tools, and libraries already in use.
2. Briefly summarize the core stack you have detected in the underlying repository.
3. Explicitly ask the user questions to confirm: "Based on the repository, I have detected these technologies and patterns. Which of these specific frameworks or tools would you like me to use for this task, or is there a specific new technology you want to introduce?"
4. **Important:** Pause and strictly wait for the user's answer before taking any further action or creating a plan.
