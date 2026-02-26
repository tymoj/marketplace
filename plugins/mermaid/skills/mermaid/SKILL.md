---
name: mermaid
description: Generate Mermaid diagrams from descriptions. Use when the user wants to create any type of Mermaid diagram including flowcharts, sequence diagrams, class diagrams, state diagrams, ER diagrams, Gantt charts, or pie charts. Also use when the user asks to visualize processes, relationships, architectures, timelines, or data as diagrams.
argument-hint: "[description of what to diagram]"
---

# Mermaid Diagram Generator

Generate valid Mermaid diagram code based on user descriptions.

## Workflow

1. Determine the best diagram type for the user's request
2. Load the corresponding reference file for correct syntax
3. Generate valid Mermaid code inside a ```mermaid fenced code block
4. Briefly explain the diagram structure

## Diagram Type Selection

Match the user's intent to the appropriate type:

| Intent | Diagram Type | Reference |
|--------|-------------|-----------|
| Process flows, decision trees, workflows | Flowchart | [flowchart.md](references/flowchart.md) |
| API calls, message passing, system interactions | Sequence | [sequence.md](references/sequence.md) |
| OOP structures, interfaces, relationships | Class | [class.md](references/class.md) |
| State machines, lifecycle, status transitions | State | [state.md](references/state.md) |
| Database schemas, data models, entity relationships | ER | [er.md](references/er.md) |
| Project schedules, task timelines, milestones | Gantt | [gantt.md](references/gantt.md) |
| Proportional data, distribution, percentages | Pie | [pie.md](references/pie.md) |

If the user specifies a type, use it. If ambiguous, pick the best fit and mention alternatives.

## Output Rules

- Always wrap output in ```mermaid code fences
- Use descriptive node IDs (not single letters) when the diagram has many nodes
- Add comments (`%%`) for complex sections
- Keep diagrams readable: prefer subgraphs/sections for 10+ nodes
- Validate syntax mentally before outputting — check the reference file for exact syntax
- If the user provides `$ARGUMENTS`, treat it as the diagram description