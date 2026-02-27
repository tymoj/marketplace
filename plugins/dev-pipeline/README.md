# dev-pipeline

Universal SDLC orchestrator for Claude Code. Runs a 5-phase development pipeline for any tech stack — from discovery through implementation, testing, and code review.

## Installation

```bash
claude plugin install dev-pipeline@<marketplace-name>
```

Or load locally for testing:

```bash
claude --plugin-dir ./plugins/dev-pipeline
```

## Usage

```
/dev-pipeline:dev-pipeline [describe the feature, bug, or refactoring task]
```

Example:

```
/dev-pipeline:dev-pipeline Add a REST endpoint for user registration with email validation
```

## How It Works

The pipeline runs 5 phases in order, with a mandatory user approval gate after Phase 2:

| Phase | Name | What Happens |
|-------|------|--------------|
| 0 | **Stack Detection** | Auto-detects your tech stack from build files and config |
| 1 | **Discovery** | Specialist agents analyze your codebase, schema, and API contracts |
| 2 | **Plan** | Produces a validated implementation blueprint with built-in gap analysis |
| 3 | **Implement** | Agent Teams execute the plan in parallel across frontend/backend |
| 4 | **Test & Review** | Generates tests, analyzes coverage, then runs code review + security audit |

Each run is isolated under `.claude/pipeline/task-xxx/` with its own output files.

## Bundled Agents (17)

| Agent | Role |
|-------|------|
| `code-explorer` | Deep codebase analysis and execution tracing |
| `schema-researcher` | Database schema and migration research |
| `api-contract-researcher` | API endpoint and contract discovery |
| `code-architect` | Implementation blueprint design |
| `jpa-expert` | JPA/Hibernate entity design (vendor-agnostic) |
| `liquibase-expert` | Liquibase changelog and migration authoring |
| `mysql-expert` | MySQL-specific SQL and optimization |
| `oracle-expert` | Oracle SQL, PL/SQL, and optimization |
| `angular-expert` | Angular components, services, and RxJS |
| `node-expert` | Node.js/Express/NestJS backend |
| `python-expert` | Python/FastAPI/Django backend |
| `code-simplifier` | Post-implementation cleanup |
| `test-generator` | Universal test generation |
| `test-analyzer` | Test coverage quality analysis |
| `code-reviewer` | Code quality review (confidence >= 80 filter) |
| `security-reviewer` | OWASP security audit |
| `silent-failure-hunter` | Error handling audit |

## Bundled Skills (11)

`spring-conventions`, `jpa-patterns`, `rest-api-design`, `rabbitmq-patterns`, `spring-security-patterns`, `frontend-design`, `tech-router`, `testing-strategy`, `testing-strategy-java`, `testing-strategy-node`, `testing-strategy-python`

## Optional Dependencies

| Plugin | Benefit |
|--------|---------|
| `mermaid` | Adds Mermaid diagram generation to Phase 2 plans |

## Requirements

- Claude Code v1.0.33+

## License

MIT
