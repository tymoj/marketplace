---
name: tech-router
description: Universal technology routing guide. Auto-loaded to route tasks to the correct specialist agent for any detected stack. Consulted automatically when selecting which agent to delegate work to.
user-invocable: false
---

When a technical task arrives, identify the domain and route to the correct specialist agent.

## Backend Routing

| Technology / Domain | Route to Agent |
|---|---|
| Java entities, JPA relationships, JPQL, Spring Data, N+1 issues | `jpa-expert` |
| MySQL native SQL, EXPLAIN, indexes, Flyway (MySQL DDL) | `mysql-expert` |
| Oracle native SQL, PL/SQL, sequences, Flyway (Oracle DDL) | `oracle-expert` |
| Liquibase changelogs, changesets, rollback, preconditions, Spring Boot Liquibase config | `liquibase-expert` |
| RabbitMQ, Spring AMQP, exchanges, queues, listeners, producers, DLQ | `jpa-expert` (with `rabbitmq-patterns` skill) |
| Spring Security, JWT, OAuth2, CORS, authentication, authorization | `jpa-expert` (with `spring-security-patterns` skill) |
| Node.js, Express, Fastify, NestJS | `node-expert` |
| Python, FastAPI, Django, Flask, SQLAlchemy | `python-expert` |

## Frontend Routing

| Technology / Domain | Route to Agent |
|---|---|
| Angular components, services, RxJS, NgModules | `angular-expert` |

## Database Detection (from datasource URL)

| URL pattern | DB Agent |
|---|---|
| `mysql`, `mariadb` | `mysql-expert` |
| `oracle`, `thin:@` | `oracle-expert` |
| `mongodb` | Use `node-expert` or `python-expert` with MongoDB context |

## Universal Routing (stack-agnostic)

| Situation | Route to Agent |
|---|---|
| Before any structural change | `architecture-researcher` (plan mode) |
| Before any DB/schema change | `schema-researcher` (plan mode) |
| Before any API change | `api-contract-researcher` (plan mode) |
| After any code change | `code-reviewer` |
| After any security-sensitive change | `security-reviewer` |
| Tests for any stack | `test-generator` (reads stack.md for framework) |

## Messaging Detection

| Dependency / Config | Route to |
|---|---|
| `spring-boot-starter-amqp`, `spring.rabbitmq.*` | Use `rabbitmq-patterns` skill |
| `spring-kafka`, `spring.kafka.*` | `node-expert` or `python-expert` (if non-Java) |
| `spring-cloud-stream` | Use `rabbitmq-patterns` skill (if RabbitMQ binder) |

## Routing Rules

1. For a task spanning multiple domains, run specialists sequentially (DB migration before entity before service before controller)
2. Always run a research agent in plan mode BEFORE a write agent
3. After any code change, proactively run code-reviewer
4. After any security-sensitive change, proactively run security-reviewer
5. For RabbitMQ tasks, load `rabbitmq-patterns` skill alongside the implementation agent
6. For security tasks (auth, JWT, CORS), load `spring-security-patterns` skill
7. If stack is unknown, read `.claude/pipeline/stack.md`
8. If that file doesn't exist, read `pom.xml`, `package.json`, `requirements.txt`
9. Never assume a stack without evidence from project files
