# tech-architect

Routes architecture and planning tasks to the right specialist agent by auto-detecting your project's tech stack. Supports Spring Boot, Java, and Oracle out of the box.

## Installation

```bash
claude plugin install tech-architect@<marketplace-name>
```

Or load locally for testing:

```bash
claude --plugin-dir ./plugins/tech-architect
```

## Usage

```
/tech-architect:tech-architect [describe the task or feature to architect]
```

Examples:

```
/tech-architect:tech-architect Design the API layer for order management
/tech-architect:tech-architect Plan the database schema for multi-tenant support
```

## How It Works

1. **Detect** — Scans build files (`pom.xml`, `build.gradle`, `package.json`, etc.) and config files to identify your stack
2. **Classify** — Maps signals to a primary category: `spring-boot`, `java`, `nodejs`, `python`, or `unknown`
3. **Route** — Delegates to the matching specialist architect agent

Oracle database detection is additive — a Spring Boot + Oracle project routes to `spring-boot-architect` with the Oracle signal included.

## Bundled Agents (3)

| Agent | Specialization |
|-------|---------------|
| `spring-boot-architect` | Spring Boot application architecture |
| `java-architect` | General Java/JVM project architecture |
| `oracle-architect` | Oracle database design and PL/SQL |

## Extensibility

Add new specialist architects by dropping an agent `.md` file into the `agents/` directory and updating the routing logic in the skill.

## Requirements

- Claude Code v1.0.33+

## License

MIT
