# Changelog

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
