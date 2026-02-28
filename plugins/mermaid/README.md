# mermaid

Generate, validate, and render Mermaid diagrams with syntax-aware hooks and a specialized architect agent.

## Installation

```bash
claude plugin install mermaid@tymoj/marketplace
```

Or load locally for testing:

```bash
claude --plugin-dir ./plugins/mermaid
```

## Usage

```
/mermaid:mermaid [description of what to diagram]
```

Examples:

```
/mermaid:mermaid User authentication flow with OAuth2
/mermaid:mermaid ER diagram for the orders database
/mermaid:mermaid Gantt chart for Q1 release milestones
```

## Supported Diagram Types

| Type | Use For |
|------|---------|
| Flowchart | Process flows, decision trees, workflows |
| Sequence | API calls, message passing, system interactions |
| Class | OOP structures, interfaces, relationships |
| State | State machines, lifecycle, status transitions |
| ER | Database schemas, data models, entity relationships |
| Gantt | Project schedules, task timelines, milestones |
| Pie | Proportional data, distribution, percentages |

## Components

### Skill: `mermaid`

Generates valid Mermaid diagram code from natural language descriptions. Selects the best diagram type automatically and loads the corresponding syntax reference.

### Agent: `mermaid-architect`

Specialized agent for complex, multi-diagram architecture visualization tasks.

### Hook: Post-Write/Edit Validation

Automatically validates Mermaid syntax in files after `Write` or `Edit` operations using the bundled `validate-mermaid.sh` script.

## Requirements

- Claude Code v1.0.33+
