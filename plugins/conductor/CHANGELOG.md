# Changelog

## [1.4.0] - 2026-03-03

### Added
- `dev-init` skill — bootstraps pipeline files without running the full pipeline. Generates a task ID, auto-detects the stack, and writes `stack.md`, `implementation-log.md`, and `task.md` so individual agents (`test-generator`, `code-reviewer`, `dev-sync`, etc.) can be run standalone. Invoke as `/dev-init [description]`.

## [1.3.0] - 2026-03-03

### Added
- `tidb-expert` agent — TiDB distributed SQL specialist covering `AUTO_RANDOM` IDs, TiFlash columnar analytics, distributed transaction tuning (optimistic/pessimistic), `EXPLAIN ANALYZE` interpretation, and Flyway/Liquibase migrations with TiDB DDL constraints.

## [1.2.0] - 2026-03-03

### Added
- `dev-sync` skill — reconciles pipeline artifacts after manual code changes or refactors. Updates `implementation-log.md` and optionally `plan.md` to reflect what actually exists in the codebase. Invoke as `/dev-sync [task-id]`.

## [1.1.0] - 2025-12-01

### Added
- Built-in gap analysis in Phase 2 (previously required external `advanced-plan` plugin)
- Agent Teams for parallel implementation in Phase 3
- `code-simplifier` agent for post-implementation cleanup
- `silent-failure-hunter` agent for error handling audits
- `test-analyzer` agent for test coverage quality analysis
- Confidence-based filtering (>= 80) in code reviewer

### Changed
- Merged `advanced-plan` functionality into Phase 2 Step 3
- Isolated pipeline runs under `.claude/pipeline/task-xxx/`

## [1.0.0] - 2025-11-01

### Added
- Initial release with 5-phase SDLC pipeline
- 17 specialist agents
- 11 domain-knowledge skills
- Auto-detection for Spring Boot, Java, Node.js, Python, Angular
- Optional Mermaid diagram integration for Phase 2 plans
